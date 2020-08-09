import fs from 'fs-extra';
import { PackageJson } from 'packages/cli/dist/types';
import { paths } from './env/paths';

let appPackageJson: PackageJson;
try {
  appPackageJson = fs.readJSONSync(paths.appPackageJson);
} catch (e) {}

export { appPackageJson };
