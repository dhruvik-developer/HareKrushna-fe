import toast from "react-hot-toast";
import ApiInstance from "../services/ApiInstance";

export const addVendor = async (data) => {
  try {
    const response = await ApiInstance.post("/vendors/", data);
    if (
      response.data?.status ||
      response.data?.id ||
      response.status === 201 ||
      response.status === 200
    ) {
      toast.success(response.data?.message || "Vendor added successfully!");
      return response;
    } else {
      toast.error("Failed to add vendor.");
      return null;
    }
  } catch (error) {
    console.error("Error adding vendor:", error);
    toast.error(
      error?.response?.data?.message ||
        "Something went wrong! Please try again."
    );
    return null;
  }
};

export const updateVendor = async (id, data) => {
  try {
    const response = await ApiInstance.put(`/vendors/${id}/`, data);
    if (response.data?.status || response.data?.id || response.status === 200) {
      toast.success(response.data?.message || "Vendor updated successfully!");
      return response;
    } else {
      toast.error("Failed to update vendor.");
      return null;
    }
  } catch (error) {
    console.error("Error updating vendor:", error);
    toast.error(
      error?.response?.data?.message ||
        "Something went wrong! Please try again."
    );
    return null;
  }
};
