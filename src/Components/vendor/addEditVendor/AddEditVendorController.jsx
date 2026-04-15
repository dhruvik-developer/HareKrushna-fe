import toast from "react-hot-toast";
import AddEditVendorComponent from "./AddEditVendorComponent";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { addVendor, updateVendor } from "../../../apis/PostVendor";
import { getIngredientCategories } from "../../../apis/FetchVendor";

function AddEditVendorController() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { state } = location || {};
  const mode = state?.mode || "add";

  const [form, setForm] = useState({
    name: "",
    mobile_no: "",
    address: "",
    is_active: true,
  });
  const [vendorCategories, setVendorCategories] = useState([]);
  const [availableCategories, setAvailableCategories] = useState([]);
  const [errors, setErrors] = useState({});

  // Fetch ingredient categories for dropdown
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getIngredientCategories();
        if (response?.data?.data) {
          setAvailableCategories(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  // Pre-populate form for edit mode
  useEffect(() => {
    if (mode === "edit" && state?.vendorData) {
      const v = state.vendorData;
      setForm({
        name: v.name || "",
        mobile_no: v.mobile_no || "",
        address: v.address || "",
        is_active: v.is_active !== undefined ? v.is_active : true,
      });
      // Map existing vendor_categories to editable state
      if (v.vendor_categories?.length > 0) {
        setVendorCategories(
          v.vendor_categories.map((vc) => ({
            category: vc.category,
            price: vc.price != null ? String(vc.price) : "",
          }))
        );
      }
    }
  }, [mode, state]);

  const onInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === "mobile_no") {
      const formattedValue = value.replace(/[^0-9]/g, "").slice(0, 10);
      setForm((prev) => ({ ...prev, mobile_no: formattedValue }));
      if (errors.mobile_no) {
        setErrors((prev) => ({ ...prev, mobile_no: "" }));
      }
      return;
    }

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // Category row handlers
  const handleCategoryChange = (index, field, value) => {
    setVendorCategories((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };

      // Auto-add new row when selecting a category in the last row
      const isLastRow = index === updated.length - 1;
      if (isLastRow && field === "category" && value) {
        updated.push({ category: "", price: "" });
      }

      return updated;
    });
  };

  const handleRemoveCategory = (index) => {
    setVendorCategories((prev) => {
      const filtered = prev.filter((_, i) => i !== index);
      // Ensure there's always one empty row at the end
      const lastItem = filtered[filtered.length - 1];
      if (!lastItem || lastItem.category) {
        filtered.push({ category: "", price: "" });
      }
      return filtered;
    });
  };

  const handleAddCategoryRow = () => {
    setVendorCategories((prev) => [...prev, { category: "", price: "" }]);
  };

  const validateForm = () => {
    let newErrors = {};
    if (!form.name.trim()) newErrors.name = "Vendor name is required";
    if (form.mobile_no && form.mobile_no.length !== 10) {
      newErrors.mobile_no = "Mobile number must be exactly 10 digits";
    }

    setErrors(newErrors);
    const isValid = Object.keys(newErrors).length === 0;
    if (!isValid) toast.error("Please fill in all required fields.");
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      // Filter out empty category rows and build payload
      const filledCategories = vendorCategories
        .filter((vc) => vc.category)
        .map((vc) => ({
          category: Number(vc.category),
          price: vc.price ? parseFloat(vc.price) : null,
        }));

      const payload = {
        name: form.name.trim(),
        mobile_no: form.mobile_no.trim(),
        address: form.address.trim(),
        is_active: form.is_active,
        vendor_categories: filledCategories,
      };

      let response;
      if (mode === "edit") {
        response = await updateVendor(id, payload);
      } else {
        response = await addVendor(payload);
      }

      if (response) {
        navigate("/vendor");
      }
    } catch (error) {
      toast.error(`Failed to ${mode === "edit" ? "update" : "add"} vendor`);
      console.error("API Error:", error);
    }
  };

  return (
    <AddEditVendorComponent
      navigate={navigate}
      mode={mode}
      form={form}
      errors={errors}
      vendorCategories={vendorCategories}
      availableCategories={availableCategories}
      onInputChange={onInputChange}
      onSubmit={handleSubmit}
      handleCategoryChange={handleCategoryChange}
      handleRemoveCategory={handleRemoveCategory}
      handleAddCategoryRow={handleAddCategoryRow}
    />
  );
}

export default AddEditVendorController;
