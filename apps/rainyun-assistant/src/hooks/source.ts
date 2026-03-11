export const useSourceInfo = () => {
  return {
    commitId: __BUILD_INFO__.commitHash,
    commitTime: __BUILD_INFO__.commitTimestamp,
    buildTime: __BUILD_INFO__.buildTimestamp,
    packageVersion: __PACKAGE_VERSION__,
  }
}
