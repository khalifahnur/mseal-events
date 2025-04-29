import apiClient from "@/lib/apiClient";
import { AuthData, AuthResponse, AuthStaff, AuthStaffResponse } from "../../types/auth";
import { ErrorResponse, MerchResponse,Merchandise } from "../../types/merch";
import { DeleteResponse, EditResponse, EventData, EventResponse } from "../../types/event";

/* eslint-disable @typescript-eslint/no-explicit-any */
export const loginAdmin = async (data: AuthData): Promise<AuthResponse> => {
  try {
    const response = await apiClient.post<AuthResponse>(
      "/auth-admin/signin-admin",
      data,
      { withCredentials: true }
    );
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || "An error occurred");
  }
};

/* eslint-disable @typescript-eslint/no-explicit-any */
export const signUpAdmin = async (data: AuthData): Promise<AuthResponse> => {
  try {
    const response = await apiClient.post<AuthResponse>(
      "/auth-admin/signup-admin",
      data
    );
    return response.data;
  } catch (error: any) {
    if (error?.response) {
      console.error("Sign-up error details:", error.response);
      // Show a more specific error message
      const errorMessage =
        error?.response?.data?.message || "An error occurred during sign up.";
      throw new Error(errorMessage);
    } else {
      // response (network issues, etc.)
      console.error("Network error or no response:", error);
      throw new Error("Network error or no response from server.");
    }
  }
};

/* eslint-disable @typescript-eslint/no-explicit-any */
export const signUpStaff = async (data: AuthStaff): Promise<AuthStaffResponse> => {
  try {
    const response = await apiClient.post<AuthStaffResponse>(
      "/auth-admin/Staff/app-signup",
      data
    );
    return response.data;
  } catch (error: any) {
    if (error?.response) {
      console.error("Sign-up error details:", error.response);
      // Show a more specific error message
      const errorMessage =
        error?.response?.data?.message || "An error occurred during sign up.";
      throw new Error(errorMessage);
    } else {
      // response (network issues, etc.)
      console.error("Network error or no response:", error);
      throw new Error("Network error or no response from server.");
    }
  }
};

/* eslint-disable @typescript-eslint/no-explicit-any */
export async function fetchAllStaff() {
  try {
    const response = await apiClient.get("/auth-admin/fetch-all-staff-details");
    return response.data;
  } catch (error: any) {
    if (error?.response) {
      console.error("Error fetching all staff:", error.response);
      // Show a more specific error message
      const errorMessage =
        error?.response?.data?.message || "Error fetching all staff.";
      throw new Error(errorMessage);
    } else {
      // response (network issues, etc.)
      console.error("Network error or no response:", error);
      throw new Error("Network error or no response from server.");
    }
  }
}

/* eslint-disable @typescript-eslint/no-explicit-any */
export async function fetchAdminInfo() {
  try {
    const response = await apiClient.get("/auth-admin/fetch-admin-info");
    return response.data;
  } catch (error: any) {
    if (error?.response) {
      console.error("Error fetching admin info:", error.response);
      // Show a more specific error message
      const errorMessage =
        error?.response?.data?.message || "Error fetching admin info.";
      throw new Error(errorMessage);
    } else {
      // response (network issues, etc.)
      console.error("Network error or no response:", error);
      throw new Error("Network error or no response from server.");
    }
  }
}
type CreateEventInput = Omit<EventData, "_id" | "totalTickets">;

/* eslint-disable @typescript-eslint/no-explicit-any */
export const createEvent = async (data:CreateEventInput): Promise<EventResponse> => {
  try {
    const response = await apiClient.post<EventResponse>(
      "/event/create-event",
      data,
      { withCredentials: true }
    );
    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw {
        message: error.response.data?.message || "Failed to create event",
        statusCode: error.response.status,
        details: error.response.data?.details,
      } as ErrorResponse;
    } else if (error.request) {
      throw {
        message: "No response received from server",
        statusCode: 503,
      } as ErrorResponse;
    } else {
      throw {
        message: error.message || "An unexpected error occurred",
        details: error,
      } as ErrorResponse;
    }
  }
};

/* eslint-disable @typescript-eslint/no-explicit-any */
export async function fetchEvents() {
  try {
    const response = await apiClient.get("/event/fetch-all-events");
    return response.data;
  } catch (error: any) {
    if (error?.response) {
      console.error("Error fetching all events:", error.response);
      // Show a more specific error message
      const errorMessage =
        error?.response?.data?.message || "Error fetching all events.";
      throw new Error(errorMessage);
    } else {
      // response (network issues, etc.)
      console.error("Network error or no response:", error);
      throw new Error("Network error or no response from server.");
    }
  }
}

export const deleteEvent = async (
  itemId: string
): Promise<DeleteResponse> => {
  try {
    const response = await apiClient.delete<DeleteResponse>(
      `/event/delete-event/${itemId}`
    );
    return response.data;
  } catch (error: any) {
    if (error?.response) {
      console.error("Remove event error details:", error.response);

      const errorMessage =
        error.response.data?.message ||
        "An error occurred while removing event.";

      throw {
        message: errorMessage,
        statusCode: error.response.status,
        details: error.response.data,
      } as ErrorResponse;
    } else {
      console.error("Network error or no response:", error);
      throw {
        message: "Network error or no response from the server.",
      } as ErrorResponse;
    }
  }
};

export const editEvent = async (
  updatedItem: EventData,
  itemId: string
): Promise<EditResponse> => {
  try {
    const response = await apiClient.put<EditResponse>(
      `/event/update-event/${itemId}`,
      updatedItem
    );
    return response.data;
  } catch (error: any) {
    if (error?.response) {
      const errorMessage =
        error.response.data?.message || "Error updating the event.";
      throw new Error(errorMessage);
    } else {
      throw new Error("Network error or no response from the server.");
    }
  }
};

/* eslint-disable @typescript-eslint/no-explicit-any */
export const createMerchandise = async (
  data: Omit<Merchandise, "id">
): Promise<MerchResponse> => {
  try {
    const response = await apiClient.post<MerchResponse>(
      "/merchandise/create-new-merchandise",
      data,
      { withCredentials: true }
    );
    return response.data;
  } catch (error: any) {
    if (error.response) {
      // Handle API response errors
      throw {
        message: error.response.data?.message || "Failed to create merchandise",
        statusCode: error.response.status,
        details: error.response.data?.details,
      } as ErrorResponse;
    } else if (error.request) {
      // Handle no response errors
      throw {
        message: "No response received from server",
        statusCode: 503,
      } as ErrorResponse;
    } else {
      // Handle other errors
      throw {
        message: error.message || "An unexpected error occurred",
        details: error,
      } as ErrorResponse;
    }
  }
};

/* eslint-disable @typescript-eslint/no-explicit-any */
export async function fetchAllMerchandise() {
  try {
    const response = await apiClient.get("/merchandise/fetch-merchandise");
    return response.data;
  } catch (error: any) {
    if (error?.response) {
      console.error("Error fetching merchandise:", error.response);
      // Show a more specific error message
      const errorMessage =
        error?.response?.data?.message || "Error fetching merchandise.";
      throw new Error(errorMessage);
    } else {
      // response (network issues, etc.)
      console.error("Network error or no response:", error);
      throw new Error("Network error or no response from server.");
    }
  }
}

/* eslint-disable @typescript-eslint/no-explicit-any */
export const deleteMerchandise = async (
  itemId: string
): Promise<DeleteResponse> => {
  try {
    const response = await apiClient.delete<DeleteResponse>(
      `/merchandise/${itemId}/remove-merchandise`
    );
    return response.data;
  } catch (error: any) {
    if (error?.response) {
      console.error("Remove merchandise error details:", error.response);

      const errorMessage =
        error.response.data?.message ||
        "An error occurred while removing merchandise.";

      throw {
        message: errorMessage,
        statusCode: error.response.status,
        details: error.response.data,
      } as ErrorResponse;
    } else {
      console.error("Network error or no response:", error);
      throw {
        message: "Network error or no response from the server.",
      } as ErrorResponse;
    }
  }
};

/* eslint-disable @typescript-eslint/no-explicit-any */
export const editMerchandise = async (
  updatedItem: Merchandise,
  itemId: string
): Promise<EditResponse> => {
  try {
    const response = await apiClient.put<EditResponse>(
      `/merchandise/${itemId}/update-merchandise`,
      updatedItem
    );
    return response.data;
  } catch (error: any) {
    if (error?.response) {
      const errorMessage =
        error.response.data?.message || "Error updating the merchandise.";
      throw new Error(errorMessage);
    } else {
      throw new Error("Network error or no response from the server.");
    }
  }
};
