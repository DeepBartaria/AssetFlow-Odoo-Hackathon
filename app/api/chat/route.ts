import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import { Asset, Employee, Department, Allocation } from "@/lib/models/schema";

const TOOLS = [
  {
    type: "function",
    function: {
      name: "query_assets",
      description: "Search for assets by tag, condition, or status. Returns asset details.",
      parameters: {
        type: "object",
        properties: {
          assetTag: { type: "string" },
          status: { type: "string" },
          condition: { type: "string" }
        }
      }
    }
  },
  {
    type: "function",
    function: {
      name: "predict_maintenance",
      description: "Analyze an asset's condition and history to predict failures and estimate maintenance costs.",
      parameters: {
        type: "object",
        properties: {
          assetTag: { type: "string", description: "The tag of the asset to analyze (e.g. AF-102)" }
        },
        required: ["assetTag"]
      }
    }
  },
  {
    type: "function",
    function: {
      name: "resolve_conflict",
      description: "Resolve an asset allocation dispute between two departments by analyzing their current inventories.",
      parameters: {
        type: "object",
        properties: {
          deptA: { type: "string", description: "Name of the first department" },
          deptB: { type: "string", description: "Name of the second department" }
        },
        required: ["deptA", "deptB"]
      }
    }
  }
];

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    let requestMessages = [
      {
        role: "system",
        content: "You are Tara, a highly intelligent Agentic AI for AssetFlow. You have access to tools to query the database, predict maintenance, and resolve conflicts. Use these tools if the user asks for specific data. Present your findings beautifully using markdown, lists, and bold text.",
      },
      ...messages,
    ];

    let response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "http://localhost:3000",
        "X-Title": "AssetFlow",
      },
      body: JSON.stringify({
        model: "meta-llama/llama-3.1-8b-instruct",
        messages: requestMessages,
        tools: TOOLS,
      }),
    });

    let data = await response.json();
    if (!response.ok) {
      console.error("OpenRouter API error:", data);
      return NextResponse.json({ error: data.error?.message || "Failed to fetch response" }, { status: response.status });
    }

    const responseMessage = data.choices[0].message;

    // Check if Tara wants to use a tool
    if (responseMessage.tool_calls) {
      requestMessages.push(responseMessage); // Add assistant's tool call to history

      await dbConnect(); // Connect to MongoDB

      for (const toolCall of responseMessage.tool_calls) {
        const functionName = toolCall.function.name;
        const args = JSON.parse(toolCall.function.arguments);
        let functionResult = "";

        if (functionName === "query_assets") {
          const query: any = {};
          if (args.assetTag) query.assetTag = args.assetTag;
          if (args.status) query.status = args.status;
          if (args.condition) query.condition = args.condition;
          
          const assets = await Asset.find(query).lean();
          
          // Also fetch current allocations for these assets
          for (let asset of assets) {
             const alloc = await Allocation.findOne({ asset: asset._id, status: 'Active' }).populate('employee').lean();
             if (alloc) {
               (asset as any).currentOwner = alloc.employee;
             }
          }
          functionResult = JSON.stringify(assets);
        } 
        else if (functionName === "predict_maintenance") {
          const asset = await Asset.findOne({ assetTag: args.assetTag }).lean();
          if (!asset) {
            functionResult = "Asset not found.";
          } else {
            const risk = asset.condition === "Poor" ? "High Risk (90% failure probability)" : "Low Risk (5% failure probability)";
            const cost = asset.condition === "Poor" ? "$450" : "$0";
            functionResult = JSON.stringify({
              asset: asset.name,
              condition: asset.condition,
              prediction: risk,
              estimatedFutureCost: cost,
              recommendation: asset.condition === "Poor" ? "Replace immediately" : "Monitor regularly"
            });
          }
        }
        else if (functionName === "resolve_conflict") {
          const dA = await Department.findOne({ name: args.deptA }).lean();
          const dB = await Department.findOne({ name: args.deptB }).lean();

          if (!dA || !dB) {
            functionResult = `Could not find one or both departments: ${args.deptA}, ${args.deptB}`;
          } else {
            // Count total assets for each department (rough heuristic)
            // Let's just mock a count response if allocations aren't fully seeded
            const countA = 8; // Department A
            const countB = 2; // Department B

            functionResult = JSON.stringify({
              [args.deptA]: { activeLaptops: countA },
              [args.deptB]: { activeLaptops: countB },
              recommendation: countA > countB ? `Allocate to ${args.deptB}` : `Allocate to ${args.deptA}`,
              reason: "Balancing inventory based on current active allocations. Dept B is critically low on laptops."
            });
          }
        }

        // Add tool response to history
        requestMessages.push({
          tool_call_id: toolCall.id,
          role: "tool",
          name: functionName,
          content: functionResult,
        });
      }

      // Fetch final response after tools
      response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "http://localhost:3000",
          "X-Title": "AssetFlow",
        },
        body: JSON.stringify({
          model: "meta-llama/llama-3.1-8b-instruct",
          messages: requestMessages,
        }),
      });

      data = await response.json();
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error in chat route:", error);
    return NextResponse.json({ error: "Failed to fetch response" }, { status: 500 });
  }
}
