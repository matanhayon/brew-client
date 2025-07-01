import { API_CONFIG } from "./config";

class breweryAPI {
  private createUrl(endpoint: string, params: Record<string, string | number>) {
    const searchParams = new URLSearchParams({
      appid: API_CONFIG.API_KEY,
      ...params,
    });
    return `${endpoint}?${searchParams.toString()}`;
  }
  private async fetchData<T>(url: string): Promise<T> {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    return response.json();
  }

  async getCurrentUserData<T>(params: { userId: string | number }): Promise<T> {
    const url = this.createUrl(`${API_CONFIG.BASE_URL}/user`, {
      userId: params.userId,
    });

    return this.fetchData<T>(url);
  }
}

export default breweryAPI;
