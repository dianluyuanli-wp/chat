export const argv = process.argv;
export const useRemoteApi = argv.includes('remote');
export const useAnalyzer = argv.includes('analyze');