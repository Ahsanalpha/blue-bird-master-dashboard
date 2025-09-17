import Cookies from "js-cookie";

export interface Tenant {
  tenant_id: number;
  company_name: string;
  address: string;
  contact_person_name: string;
  contact_person_email: string;
  contact_person_phone: string;
  contact_email: string;
  contact_phone: string;
  subscription_plan: string;
  billing_cycle: string;
  status: string;
  current_subscription_id: number;
  created_at: string;
  updated_at: string;
  last_payment_date: string | null;
  next_payment_due: string | null;
}

export interface NewTenantData {
  billing_cycle: string;
  company_address: string;
  company_email: string;
  company_name: string;
  company_phone: string;
  confirm_password: string;
  contact_person_email: string;
  contact_person_first_name: string;
  contact_person_last_name: string;
  contact_person_middle_name: string;
  contact_person_phone: string;
  password: string;
  status: string;
  subscription_plan: string;
}

export interface IAllStats {
  total_tenants: number;
  active_tenants: number;
  suspended_tenants: number;
  cancelled_tenants: number;
  free_plan_tenants: number;
  standard_plan_tenants: number;
  enterprise_plan_tenants: number;
  monthly_billing_tenants: number;
  yearly_billing_tenants: number;
}

export interface TenantStats {
  total: number;
  active: number;
  premium: number;
  free: number;
  allStats: IAllStats;
}

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
const access_token = Cookies.get("access_token");

export async function refreshAccessToken() {
  Cookies.remove("access_token");
  const refresh_token = Cookies.get("refresh_token");
  console.log("refresh token:", refresh_token);
  const endpoint = process.env.NEXT_PUBLIC_BASE_URL + "auth/access-token";
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${refresh_token}`,
    },
    body: JSON.stringify({ refresh_token }),
  });
  if (!response.ok) {
    throw new Error("Failed to refresh access token");
  }
  const data = await response.json();
  const newAccessToken = data.data.access_token;
  Cookies.set("access_token", newAccessToken, { expires: 1 }); // Set cookie to expire in 1 day
  Cookies.set("refresh_token", data.data.refresh_token, { expires: 7 }); // Set refresh token to expire in 7 days
  return newAccessToken;
}

// Mock API functions - replace with actual API calls
export const tenantApi = {
  // Get all tenants
  async getTenants(): Promise<Tenant[]> {
    // Simulate API delay
    // await new Promise((resolve) => setTimeout(resolve, 500))
    const endpoint = `${baseUrl}master-admin/tenants/all`;
    const response = await fetch(endpoint, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${access_token}`,
      },
    });
    if (response.status === 401) {
      const newAccessToken = await refreshAccessToken();
      // Retry the original request with the new access token
      const retryResponse = await fetch(endpoint, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${newAccessToken}`,
        },
      });
      if (!retryResponse.ok) {
        // throw new Error("Failed to fetch tenants after refreshing token");
      }
      const retryData = await retryResponse.json();
      return retryData.data.tenants;
    }
    console.log("Get Tenants Response:", response);
    // if (!response.ok) {
    // throw new Error('Failed to fetch tenants');
    // }
    const data = await response.json();
    return data.data.tenants;
  },

  // Get tenant statistics
  async getTenantStats(): Promise<TenantStats> {
    const tenants = await this.getTenants();
    const endpoint = `${baseUrl}master-admin/tenants/stats`;
    const response = await fetch(endpoint, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${access_token}`,
      },
    });
    if (response.status === 401) {
      const newAccessToken = await refreshAccessToken();
      // Retry the original request with the new access token
      const retryResponse = await fetch(endpoint, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${newAccessToken}`,
        },
      });
      // if (!retryResponse.ok) {
      // throw new Error('Failed to fetch tenants after refreshing token');
      // }
      const retryData = await retryResponse.json();
      return {
        allStats: retryData.data.tenants,
        total: tenants.length,
        active: tenants.filter((t) => t.status === "active").length,
        premium: tenants.filter(
          (t) =>
            t.subscription_plan === "premium" ||
            t.subscription_plan === "enterprise"
        ).length,
        free: tenants.filter((t) => t.subscription_plan === "free").length,
      };
    }
    // if (!response.ok) {
    //   throw new Error('Failed to fetch tenants');
    // }
    const data = await response.json();
    console.log("Tenant Stats Data:", data);

    return {
      allStats: data.data,
      total: tenants.length,
      active: tenants.filter((t) => t.status === "active").length,
      premium: tenants.filter(
        (t) =>
          t.subscription_plan === "premium" ||
          t.subscription_plan === "enterprise"
      ).length,
      free: tenants.filter((t) => t.subscription_plan === "free").length,
    };
  },

  // Create a new tenant
  async createTenant(data: NewTenantData): Promise<Tenant> {
    // Simulate API delay
    // await new Promise((resolve) => setTimeout(resolve, 1000))
    console.log("Creating Tenant with Data:", data);
    const endpoint = `${baseUrl}master-admin/tenants/create`;
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${access_token}`,
      },
      body: JSON.stringify(data),
    });
    // if (!response.ok) {
    //   throw new Error("Failed to create tenant");
    // }
    if (response.status === 401) {
      const newAccessToken = await refreshAccessToken();
      // Retry the original request with the new access token
      const retryResponse = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${newAccessToken}`,
        },
        body: JSON.stringify(data),
      });
      // if (!retryResponse.ok) {
        // throw new Error("Failed to fetch tenants after refreshing token");
      // }
      const retryData = await retryResponse.json();
      return retryData.data;
    }
    const responseData = await response.json();
    console.log("Create Tenant Response:", responseData);

    return responseData.data;
  },

  // Get tenant by ID
   async getTenantbyID(tenant_id:number): Promise<Tenant[]> {
    // Simulate API delay
    // await new Promise((resolve) => setTimeout(resolve, 500))
    const endpoint = `${baseUrl}master-admin/tenants/${tenant_id}`;
    const response = await fetch(endpoint, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${access_token}`,
      },
    });
    if (response.status === 401) {
      const newAccessToken = await refreshAccessToken();
      // Retry the original request with the new access token
      const retryResponse = await fetch(endpoint, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${newAccessToken}`,
        },
      });
      // if (!retryResponse.ok) {
        // throw new Error("Failed to fetch tenants after refreshing token");
      // }
      const retryData = await retryResponse.json();
      return retryData.data
    }
    console.log("Get Tenants Response:", response);
    // if (!response.ok) {
    // throw new Error('Failed to fetch tenants');
    // }
    const data = await response.json();
    return data.data
  },
};
