#!/usr/bin/env node
/**
 * MCP Server for Dapp Modernization and Analysis
 * Implements the Model Context Protocol for blockchain smart contract analysis
 */
declare class DappModernizationMCPServer {
    private server;
    private dappAnalyzer;
    private mcpServer;
    private projectRoot;
    constructor();
    private setupHandlers;
    private findSolidityFiles;
    private findSolidityFilesRecursive;
    private generateMarkdownReport;
    private generateSecurityAudit;
    private analyzeDependencies;
    private estimateGasSavings;
    run(): Promise<void>;
}
export { DappModernizationMCPServer };
//# sourceMappingURL=mcpServer.d.ts.map