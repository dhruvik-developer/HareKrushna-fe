import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import VendorComponent from "./VendorComponent";
import toast from "react-hot-toast";
import { getVendors } from "../../apis/FetchVendor";
import DeleteConfirmation from "../../Components/common/DeleteConfirmation";

function VendorController() {
  const navigate = useNavigate();
  const hasFetched = useRef(false);
  const [loading, setLoading] = useState(true);
  const [vendors, setVendors] = useState([]);

  const fetchVendors = async () => {
    try {
      const response = await getVendors();
      if (response?.data?.data) {
        setVendors(response.data.data);
      } else {
        toast.error("Failed to fetch vendors");
      }
    } catch (error) {
      toast.error("Error fetching vendors");
      console.error("API Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!hasFetched.current) {
      fetchVendors();
      hasFetched.current = true;
    }
  }, []);

  // Handle Add Vendor
  const handleAddVendor = () => {
    navigate("/add-vendor", { state: { mode: "add" } });
  };

  // Handle Edit Vendor
  const handleEditVendor = (vendor) => {
    navigate(`/edit-vendor/${vendor.id}`, {
      state: { mode: "edit", vendorData: vendor },
    });
  };

  // Handle Delete Vendor
  const handleDeleteVendor = (id) => {
    DeleteConfirmation({
      id,
      apiEndpoint: "/vendors",
      name: "vendor",
      successMessage: "Vendor deleted successfully!",
      onSuccess: fetchVendors,
    });
  };

  return (
    <VendorComponent
      navigate={navigate}
      loading={loading}
      vendors={vendors}
      onVendorAdd={handleAddVendor}
      onVendorEdit={handleEditVendor}
      onVendorDelete={handleDeleteVendor}
    />
  );
}

export default VendorController;
