import { loadJsonFixture } from './data';

export interface PageData {
  [key: string]: any;
}

export class DataManager {
  private static instance: DataManager;
  private pageDataCache: Map<string, PageData> = new Map();

  private constructor() {}

  public static getInstance(): DataManager {
    if (!DataManager.instance) {
      DataManager.instance = new DataManager();
    }
    return DataManager.instance;
  }

  /**
   * Load page-specific data
   */
  public loadPageData(pageName: string): PageData {
    if (this.pageDataCache.has(pageName)) {
      return this.pageDataCache.get(pageName)!;
    }

    try {
      const data = loadJsonFixture(`pages/${pageName}Data.json`);
      this.pageDataCache.set(pageName, data);
      return data;
    } catch (error) {
      throw new Error(`Failed to load data for page: ${pageName}. Error: ${error}`);
    }
  }

  /**
   * Get specific data from page data
   */
  public getPageData<T>(pageName: string, dataPath: string): T {
    const pageData = this.loadPageData(pageName);
    const keys = dataPath.split('.');
    let result: any = pageData;

    for (const key of keys) {
      if (result && typeof result === 'object' && key in result) {
        result = result[key];
      } else {
        throw new Error(`Data path '${dataPath}' not found in page '${pageName}'`);
      }
    }

    return result as T;
  }

  /**
   * Get login data
   */
  public getLoginData(): PageData {
    return this.loadPageData('login');
  }

  /**
   * Get dashboard data
   */
  public getDashboardData(): PageData {
    return this.loadPageData('dashboard');
  }

  /**
   * Get common data
   */
  public getCommonData(): PageData {
    return this.loadPageData('common');
  }

  /**
   * Get valid users for login
   */
  public getValidUsers(): any[] {
    return this.getPageData('login', 'validUsers');
  }

  /**
   * Get invalid users for login
   */
  public getInvalidUsers(): any[] {
    return this.getPageData('login', 'invalidUsers');
  }

  /**
   * Get user by ID
   */
  public getUserById(userId: string): any {
    const validUsers = this.getValidUsers();
    const invalidUsers = this.getInvalidUsers();
    const allUsers = [...validUsers, ...invalidUsers];
    
    return allUsers.find(user => user.id === userId);
  }

  /**
   * Get selector by name for specific page
   */
  public getSelector(pageName: string, selectorName: string): string {
    return this.getPageData(pageName, `selectors.${selectorName}`);
  }

  /**
   * Get expected text for specific page
   */
  public getExpectedText(pageName: string, textName: string): string {
    return this.getPageData(pageName, `expectedTexts.${textName}`);
  }

  /**
   * Get URL for specific page
   */
  public getUrl(pageName: string, urlName: string): string {
    return this.getPageData(pageName, `urls.${urlName}`);
  }

  /**
   * Get timeout value
   */
  public getTimeout(pageName: string, timeoutName: string): number {
    return this.getPageData(pageName, `timeouts.${timeoutName}`);
  }

  /**
   * Clear cache (useful for testing)
   */
  public clearCache(): void {
    this.pageDataCache.clear();
  }
}

// Export singleton instance
export const dataManager = DataManager.getInstance();