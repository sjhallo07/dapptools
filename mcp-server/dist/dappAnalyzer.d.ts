export interface DappAnalysis {
    solidityVersion: string;
    contractsFound: number;
    security: {
        hasAccessControl: boolean;
        hasPausable: boolean;
        hasReentrancyGuard: boolean;
        hasUpgradeable: boolean;
    };
    modernization: {
        needsUpgrade: boolean;
        recommendations: string[];
        priority: 'low' | 'medium' | 'high';
    };
    dependencies: {
        foundry: boolean;
        openzeppelin: boolean;
        outdated: string[];
    };
}
export declare class DappAnalyzer {
    private rpcClient;
    private contractManager;
    private projectRoot;
    constructor(rpcUrl: string, projectRoot?: string);
    /**
     * Analyze the entire dapp for modernization opportunities
     */
    analyzeDapp(): Promise<DappAnalysis>;
    /**
     * Find all Solidity files in the project
     */
    private findSolidityFiles;
    /**
     * Recursively find Solidity files
     */
    private findSolidityFilesRecursive;
    /**
     * Analyze a single contract
     */
    private analyzeContract;
    /**
     * Analyze project dependencies
     */
    private analyzeDependencies;
    /**
     * Generate comprehensive recommendations
     */
    private generateRecommendations;
    /**
     * Print analysis report
     */
    printReport(analysis: DappAnalysis): void;
    /**
     * Generate upgrade script
     */
    generateUpgradeScript(analysis: DappAnalysis): Promise<string>;
}
//# sourceMappingURL=dappAnalyzer.d.ts.map