# Adding Custom Prompts to the MCP Server

This guide provides detailed examples of how to add your own prompts to the Dapp Modernization MCP Server.

## 📚 Table of Contents

1. [Understanding Prompts](#understanding-prompts)
2. [Basic Prompt Structure](#basic-prompt-structure)
3. [Step-by-Step: Adding a New Prompt](#step-by-step-adding-a-new-prompt)
4. [Real-World Examples](#real-world-examples)
5. [Best Practices](#best-practices)
6. [Testing Your Prompts](#testing-your-prompts)

## Understanding Prompts

MCP prompts are templates that generate structured requests for AI assistants. They combine:
- **Static context** (your prompt template)
- **Dynamic data** (analysis results, user arguments)
- **Instructions** (what you want the AI to do)

Prompts are different from tools:
- **Tools** execute code and return results
- **Prompts** generate requests for AI to process

## Basic Prompt Structure

A prompt has two parts:

### 1. Definition (in `ListPromptsRequestSchema`)

```typescript
{
    name: 'prompt_name',
    description: 'What this prompt does',
    arguments: [
        {
            name: 'argument_name',
            description: 'What this argument controls',
            required: false,  // or true
        },
    ],
}
```

### 2. Implementation (in `GetPromptRequestSchema`)

```typescript
case 'prompt_name': {
    const arg = args?.argument_name || 'default';
    
    return {
        messages: [
            {
                role: 'user',
                content: {
                    type: 'text',
                    text: `Your prompt text here...`
                },
            },
        ],
    };
}
```

## Step-by-Step: Adding a New Prompt

Let's add a "gas_optimization_plan" prompt that generates gas optimization strategies.

### Step 1: Open the Source File

```bash
cd /path/to/dapptools/mcp-server
code src/mcpServer.ts  # or use your favorite editor
```

### Step 2: Add the Prompt Definition

Find the `ListPromptsRequestSchema` handler (around line 284) and add:

```typescript
this.server.setRequestHandler(ListPromptsRequestSchema, async () => {
    return {
        prompts: [
            // ... existing prompts ...
            
            // Add your new prompt here
            {
                name: 'gas_optimization_plan',
                description: 'Generate a comprehensive gas optimization plan',
                arguments: [
                    {
                        name: 'optimization_level',
                        description: 'Level of optimization: "basic", "advanced", or "aggressive"',
                        required: false,
                    },
                    {
                        name: 'target_savings',
                        description: 'Target gas savings percentage (e.g., "20")',
                        required: false,
                    },
                ],
            },
        ],
    };
});
```

### Step 3: Implement the Prompt Logic

Find the `GetPromptRequestSchema` handler (around line 323) and add:

```typescript
this.server.setRequestHandler(GetPromptRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;

    switch (name) {
        // ... existing cases ...
        
        case 'gas_optimization_plan': {
            // Get analysis data
            const analysis = await this.dappAnalyzer.analyzeDapp();
            
            // Get arguments with defaults
            const level = args?.optimization_level || 'basic';
            const target = args?.target_savings || '15';
            
            return {
                messages: [
                    {
                        role: 'user',
                        content: {
                            type: 'text',
                            text: `Create a comprehensive gas optimization plan for this dapp:

## Current Analysis

${JSON.stringify(analysis, null, 2)}

## Optimization Parameters

- Optimization Level: ${level}
- Target Gas Savings: ${target}%
- Contracts to Optimize: ${analysis.contractsFound}

## Required Output

Please provide a structured gas optimization plan including:

### 1. Quick Wins (Immediate Impact)
List optimizations that can be implemented quickly with high impact:
- Pattern to optimize
- Expected gas savings
- Implementation difficulty
- Example code

### 2. Medium-Term Improvements
Optimizations requiring more refactoring:
- Structural changes needed
- Gas impact estimation
- Migration strategy
- Risk assessment

### 3. Advanced Optimizations
For ${level} level, include advanced techniques:
- Assembly optimizations (if aggressive)
- Storage packing strategies
- Alternative algorithm implementations
- Tradeoffs to consider

### 4. Measurement Plan
How to verify the ${target}% target:
- Baseline measurements
- Testing methodology
- Before/after comparisons

### 5. Implementation Roadmap
Prioritized list of optimizations:
- Priority order
- Dependencies
- Estimated timeline
- Success criteria

Focus on practical, production-ready optimizations suitable for the ${level} optimization level.`,
                        },
                    },
                ],
            };
        }
        
        default:
            throw new Error(`Unknown prompt: ${name}`);
    }
});
```

### Step 4: Rebuild the Server

```bash
npm run build
```

### Step 5: Test with Inspector

```bash
npx @modelcontextprotocol/inspector node dist/mcpServer.js
```

In the inspector:
1. Go to **Prompts** tab
2. Select `gas_optimization_plan`
3. Try different arguments:
   - `optimization_level`: "basic", "advanced", "aggressive"
   - `target_savings`: "10", "25", "50"

## Real-World Examples

### Example 1: Test Strategy Prompt

Perfect for generating comprehensive testing plans.

```typescript
// Definition
{
    name: 'test_strategy',
    description: 'Generate a complete testing strategy for smart contracts',
    arguments: [
        {
            name: 'coverage_target',
            description: 'Target code coverage percentage',
            required: false,
        },
        {
            name: 'focus_area',
            description: 'Testing focus: "security", "functionality", or "performance"',
            required: false,
        },
    ],
}

// Implementation
case 'test_strategy': {
    const analysis = await this.dappAnalyzer.analyzeDapp();
    const coverage = args?.coverage_target || '90';
    const focus = args?.focus_area || 'functionality';
    
    return {
        messages: [
            {
                role: 'user',
                content: {
                    type: 'text',
                    text: `Create a comprehensive testing strategy for this dapp:

Contracts: ${analysis.contractsFound}
Security Features: ${JSON.stringify(analysis.security)}
Coverage Target: ${coverage}%
Focus Area: ${focus}

Provide:
1. Test categories needed (unit, integration, e2e)
2. Critical test cases for ${focus}
3. Fuzzing strategy recommendations
4. Mock/fixture requirements
5. CI/CD integration approach
6. Coverage measurement plan to reach ${coverage}%

Include specific test scenarios for each contract type found.`,
                },
            },
        ],
    };
}
```

### Example 2: Deployment Checklist Prompt

Generates pre-deployment verification steps.

```typescript
// Definition
{
    name: 'deployment_checklist',
    description: 'Generate a pre-deployment checklist',
    arguments: [
        {
            name: 'network',
            description: 'Target network: "mainnet", "testnet", or "local"',
            required: true,
        },
        {
            name: 'contract_type',
            description: 'Type of contracts: "token", "defi", or "nft"',
            required: false,
        },
    ],
}

// Implementation
case 'deployment_checklist': {
    const analysis = await this.dappAnalyzer.analyzeDapp();
    const network = args?.network || 'testnet';
    const contractType = args?.contract_type || 'general';
    
    return {
        messages: [
            {
                role: 'user',
                content: {
                    type: 'text',
                    text: `Create a deployment checklist for ${network} deployment:

Project Analysis:
${JSON.stringify(analysis, null, 2)}

Network: ${network}
Contract Type: ${contractType}

Generate a comprehensive checklist with:

## Pre-Deployment
- [ ] Security audit items
- [ ] Code review checklist
- [ ] Test coverage verification
- [ ] Gas optimization review
- [ ] Documentation completeness

## Deployment Process
- [ ] Environment setup (${network}-specific)
- [ ] Contract compilation verification
- [ ] Deployment script testing
- [ ] Transaction parameters
- [ ] Verification steps

## Post-Deployment
- [ ] Contract verification on block explorer
- [ ] Initial configuration
- [ ] Ownership transfers
- [ ] Monitoring setup
- [ ] Emergency procedures

## Network-Specific (${network})
[Include specific considerations for ${network}]

## ${contractType} Specific
[Include considerations specific to ${contractType} contracts]

Provide specific commands and values where possible.`,
            },
        ],
    };
}
```

### Example 3: Documentation Generator Prompt

Creates comprehensive documentation for contracts.

```typescript
// Definition
{
    name: 'generate_documentation',
    description: 'Generate comprehensive documentation for smart contracts',
    arguments: [
        {
            name: 'format',
            description: 'Documentation format: "markdown", "natspec", or "wiki"',
            required: false,
        },
        {
            name: 'audience',
            description: 'Target audience: "developers", "users", or "auditors"',
            required: false,
        },
    ],
}

// Implementation
case 'generate_documentation': {
    const analysis = await this.dappAnalyzer.analyzeDapp();
    const contracts = this.findSolidityFiles();
    const format = args?.format || 'markdown';
    const audience = args?.audience || 'developers';
    
    return {
        messages: [
            {
                role: 'user',
                content: {
                    type: 'text',
                    text: `Generate ${format} documentation for this dapp:

Analysis:
${JSON.stringify(analysis, null, 2)}

Contracts Found: ${contracts.length}
Format: ${format}
Audience: ${audience}

Create comprehensive documentation including:

## Overview
- Project purpose and architecture
- Key features and capabilities
- System diagram

## Contracts
For each major contract:
- Purpose and responsibilities
- Key functions and their usage
- State variables
- Events emitted
- Access control

## Integration Guide
- How to interact with the contracts
- Common usage patterns
- Code examples for ${audience}

## Security Considerations
Based on the analysis, document:
- Security features implemented
- Known limitations
- Best practices for users

## Deployment Information
- Supported networks
- Configuration options
- Upgrade procedures (if applicable)

Format everything in ${format} style, optimized for ${audience}.`,
            },
        ],
    };
}
```

### Example 4: Upgrade Impact Analysis Prompt

Analyzes the impact of potential upgrades.

```typescript
// Definition
{
    name: 'upgrade_impact_analysis',
    description: 'Analyze the impact of proposed contract upgrades',
    arguments: [
        {
            name: 'upgrade_type',
            description: 'Type of upgrade: "security_patch", "feature_addition", or "optimization"',
            required: true,
        },
        {
            name: 'risk_tolerance',
            description: 'Risk tolerance: "conservative", "moderate", or "aggressive"',
            required: false,
        },
    ],
}

// Implementation
case 'upgrade_impact_analysis': {
    const analysis = await this.dappAnalyzer.analyzeDapp();
    const upgradeType = args?.upgrade_type || 'optimization';
    const risk = args?.risk_tolerance || 'moderate';
    
    return {
        messages: [
            {
                role: 'user',
                content: {
                    type: 'text',
                    text: `Analyze the impact of ${upgradeType} upgrade:

Current State:
${JSON.stringify(analysis, null, 2)}

Upgrade Type: ${upgradeType}
Risk Tolerance: ${risk}

Provide comprehensive impact analysis:

## 1. Technical Impact
- Contract changes required
- State migration needs
- Interface compatibility
- Gas cost changes

## 2. Risk Assessment
For ${risk} risk tolerance:
- Breaking changes
- Data loss risks
- Downtime requirements
- Rollback complexity

## 3. User Impact
- UX changes
- Migration requirements
- Communication needs
- Support considerations

## 4. Business Impact
- Cost analysis
- Timeline estimates
- Resource requirements
- ROI projection

## 5. Recommendations
Based on ${risk} risk profile:
- Go/no-go recommendation
- Mitigation strategies
- Rollout plan
- Success metrics

## 6. Alternatives
Consider other approaches:
- Phased rollout options
- Alternative implementations
- Risk-reducing strategies

Focus on ${upgradeType} specific considerations.`,
            },
        ],
    };
}
```

## Best Practices

### 1. Use Clear, Descriptive Names

❌ Bad:
```typescript
name: 'plan'
name: 'analysis'
name: 'test'
```

✅ Good:
```typescript
name: 'modernization_plan'
name: 'security_analysis'
name: 'test_strategy'
```

### 2. Provide Detailed Descriptions

❌ Bad:
```typescript
description: 'Makes a plan'
```

✅ Good:
```typescript
description: 'Generate a comprehensive modernization plan with timeline, costs, and risk assessment'
```

### 3. Use Meaningful Defaults

```typescript
const priority = args?.priority || 'medium';  // Good default
const timeline = args?.timeline || '3 months';  // Reasonable default
const coverage = args?.coverage_target || '80';  // Industry standard
```

### 4. Structure Your Prompts

Use clear sections and formatting:

```typescript
text: `# Main Goal

## Context
[Provide context]

## Requirements
1. First requirement
2. Second requirement

## Expected Output
[What you want]

## Constraints
- Constraint 1
- Constraint 2`
```

### 5. Include the Analysis Data

Always pass relevant analysis data:

```typescript
const analysis = await this.dappAnalyzer.analyzeDapp();

text: `Analysis:
${JSON.stringify(analysis, null, 2)}

Based on this analysis, please...`
```

### 6. Make Arguments Optional

Unless absolutely required:

```typescript
arguments: [
    {
        name: 'optional_param',
        description: 'Description here',
        required: false,  // Allow flexibility
    },
]
```

### 7. Provide Examples in Descriptions

```typescript
{
    name: 'timeline',
    description: 'Proposed timeline (e.g., "2 weeks", "3 months", "1 year")',
    required: false,
}
```

## Testing Your Prompts

### 1. Unit Test the Logic

```typescript
// In a test file
import { DappModernizationMCPServer } from './mcpServer';

test('gas_optimization_plan generates correct prompt', async () => {
    const server = new DappModernizationMCPServer();
    
    const result = await server.handleGetPrompt({
        name: 'gas_optimization_plan',
        arguments: {
            optimization_level: 'advanced',
            target_savings: '25'
        }
    });
    
    expect(result.messages[0].content.text).toContain('advanced');
    expect(result.messages[0].content.text).toContain('25%');
});
```

### 2. Test with Inspector

```bash
npm run build
npx @modelcontextprotocol/inspector node dist/mcpServer.js
```

Check:
- ✅ Prompt appears in list
- ✅ Arguments work correctly
- ✅ Generated text is well-formatted
- ✅ Analysis data is included

### 3. Test with Claude Desktop

Add to your config, restart Claude, and test:
```
"Hey Claude, use the gas_optimization_plan prompt with aggressive optimization level"
```

### 4. Test Edge Cases

- Empty arguments
- Invalid values
- Missing analysis data
- Very large projects

## Common Patterns

### Pattern 1: Analysis-Based Prompt

```typescript
case 'your_prompt': {
    const analysis = await this.dappAnalyzer.analyzeDapp();
    
    return {
        messages: [{
            role: 'user',
            content: {
                type: 'text',
                text: `Based on this analysis:
                
${JSON.stringify(analysis, null, 2)}

Please [your instructions]...`
            }
        }]
    };
}
```

### Pattern 2: Contract-Specific Prompt

```typescript
case 'your_prompt': {
    const contracts = this.findSolidityFiles();
    const contractPath = args?.contract_path;
    
    if (contractPath && !contracts.includes(contractPath)) {
        throw new Error(`Contract not found: ${contractPath}`);
    }
    
    return {
        messages: [{
            role: 'user',
            content: {
                type: 'text',
                text: `Analyze contract: ${contractPath}...`
            }
        }]
    };
}
```

### Pattern 3: Multi-Step Workflow Prompt

```typescript
case 'your_prompt': {
    const step = args?.step || '1';
    const analysis = await this.dappAnalyzer.analyzeDapp();
    
    const instructions = {
        '1': 'First, analyze the current state...',
        '2': 'Next, identify opportunities...',
        '3': 'Finally, create implementation plan...'
    };
    
    return {
        messages: [{
            role: 'user',
            content: {
                type: 'text',
                text: `Step ${step}: ${instructions[step]}
                
Analysis: ${JSON.stringify(analysis, null, 2)}`
            }
        }]
    };
}
```

## Debugging Tips

### Check the Logs

The MCP server logs to stderr:
```bash
node dist/mcpServer.js 2> mcp-server.log
```

### Test Directly

```bash
node -e "
import('./dist/mcpServer.js').then(module => {
  console.log('Prompts:', module.DappModernizationMCPServer);
});
"
```

### Validate JSON Structure

Use a TypeScript type checker:
```typescript
import { GetPromptResult } from '@modelcontextprotocol/sdk/types.js';

const result: GetPromptResult = {
    messages: [{ /* ... */ }]
};
```

## Next Steps

1. **Start Simple** - Add a basic prompt first
2. **Test Thoroughly** - Use the inspector
3. **Iterate** - Refine based on results
4. **Document** - Add to this guide
5. **Share** - Contribute back to the project

## Additional Resources

- [MCP Protocol Spec](https://modelcontextprotocol.io/)
- [TypeScript SDK Docs](https://github.com/modelcontextprotocol/typescript-sdk)
- [Claude Desktop Integration](https://docs.anthropic.com/claude/docs/mcp)
- [Example Prompts Repository](https://github.com/modelcontextprotocol/servers)

---

**Happy prompt building! 🚀**
