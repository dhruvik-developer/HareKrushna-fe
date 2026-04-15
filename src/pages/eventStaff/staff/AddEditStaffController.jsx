import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import {
  createRole,
  createStaff,
  getRoles,
  getSingleStaff,
  getWaiterTypes,
  updateStaff,
} from "../../../apis/EventStaffApis";
import AddEditStaffComponent from "./AddEditStaffComponent";

const ADD_NEW_ROLE_OPTION_VALUE = "__ADD_NEW__";

function createEmptyRoleForm() {
  return {
    name: "",
    description: "",
  };
}

function getRoleLabel(roleObj = {}) {
  const safeRole =
    roleObj && typeof roleObj === "object" ? roleObj : {};

  return String(
    safeRole.name ||
      safeRole.role ||
      safeRole.title ||
      safeRole.label ||
      ""
  ).trim();
}

function normalizeCollectionResponse(response) {
  const payload = response?.data;
  const sanitize = (list) =>
    Array.isArray(list) ? list.filter((entry) => entry && typeof entry === "object") : [];

  if (Array.isArray(payload)) return sanitize(payload);
  if (Array.isArray(payload?.data)) return sanitize(payload.data);

  return [];
}

function normalizeEntityResponse(response) {
  return response?.data?.data || response?.data || null;
}

function getApiErrorMessage(error, fallbackMessage) {
  const data = error?.response?.data;

  if (!data) return fallbackMessage;
  if (typeof data === "string") return data;
  if (typeof data.message === "string" && data.message.trim()) {
    return data.message;
  }
  if (typeof data.detail === "string" && data.detail.trim()) {
    return data.detail;
  }
  if (Array.isArray(data.detail) && data.detail[0]) {
    return data.detail[0];
  }
  if (Array.isArray(data.non_field_errors) && data.non_field_errors[0]) {
    return data.non_field_errors[0];
  }

  const [firstKey] = Object.keys(data);
  if (!firstKey) return fallbackMessage;

  const firstValue = data[firstKey];
  if (Array.isArray(firstValue) && firstValue[0]) {
    return firstValue[0];
  }
  if (typeof firstValue === "string" && firstValue.trim()) {
    return firstValue;
  }

  return fallbackMessage;
}

function AddEditStaffController() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();

  const stateMode = location.state?.mode;
  const mode = stateMode ? stateMode : id ? "edit" : "add";

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const [rolesList, setRolesList] = useState([]);
  const [waiterTypes, setWaiterTypes] = useState([]);
  const [waiterTypesLoading, setWaiterTypesLoading] = useState(true);
  const [isAddRoleModalOpen, setIsAddRoleModalOpen] = useState(false);
  const [roleModalForm, setRoleModalForm] = useState(createEmptyRoleForm());
  const [roleModalErrors, setRoleModalErrors] = useState({});
  const [isAddingRole, setIsAddingRole] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    role: "",
    staff_type: "Contract",
    waiter_type_id: "",
    agency_name: "",
    contract_rate: "",
    fixed_salary: "",
    joining_date: new Date().toISOString().split("T")[0],
    per_day_rate: "0.00",
    is_active: true,
  });

  const resetRoleModal = () => {
    setRoleModalForm(createEmptyRoleForm());
    setRoleModalErrors({});
  };

  const findRoleByValue = (roleValue, availableRoles = rolesList) => {
    const safeRoles = Array.isArray(availableRoles) ? availableRoles : [];
    const normalizedValue = String(roleValue || "").trim();
    const lowerValue = normalizedValue.toLowerCase();

    if (!normalizedValue) return null;

    return (
      safeRoles.find((roleObj) => {
        const roleId = String(roleObj?.id || "").trim();
        const roleName = getRoleLabel(roleObj).toLowerCase();
        return roleId === normalizedValue || roleName === lowerValue;
      }) || null
    );
  };

  const populateForm = (data, availableRoles = rolesList) => {
    const rawRoleValue =
      data?.role?.id || data?.role_id || data?.role || data?.role_name || "";
    const matchedRole = findRoleByValue(rawRoleValue, availableRoles);

    setFormData({
      id: data.id,
      name: data.name || "",
      phone: data.phone || "",
      role: matchedRole?.id ? String(matchedRole.id) : String(rawRoleValue || ""),
      staff_type: data.staff_type || "Contract",
      waiter_type_id:
        data.waiter_type?.id || data.waiter_type_id || data.waiter_type || "",
      agency_name: data.agency_name || "",
      contract_rate: data.contract_rate || "",
      fixed_salary: data.fixed_salary || "",
      joining_date: data.joining_date ? data.joining_date.split("T")[0] : "",
      per_day_rate: data.per_person_rate || data.per_day_rate || "0.00",
      is_active: data.is_active !== undefined ? data.is_active : true,
    });
  };

  useEffect(() => {
    let isMounted = true;

    const fetchInitialData = async () => {
      try {
        const [rolesRes, waiterTypesRes] = await Promise.all([
          getRoles(),
          getWaiterTypes(),
        ]);

        if (!isMounted) return;

        const rolesData = normalizeCollectionResponse(rolesRes);
        const waiterTypesData = normalizeCollectionResponse(waiterTypesRes);

        setRolesList(rolesData);
        setWaiterTypes(waiterTypesData);

        if (mode === "add") {
          setFormData((prev) => {
            if (String(prev.role || "").trim()) return prev;

            const defaultRoleId = rolesData[0]?.id;
            return defaultRoleId
              ? { ...prev, role: String(defaultRoleId) }
              : prev;
          });
        }

        if (mode === "edit") {
          if (location.state?.staffData) {
            populateForm(location.state.staffData, rolesData);
          } else if (id) {
            const response = await getSingleStaff(id);
            const staffData = normalizeEntityResponse(response);

            if (staffData) {
              populateForm(staffData, rolesData);
            } else {
              toast.error("Failed to fetch staff details");
              navigate(-1);
            }
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Error loading form data");

        if (mode === "edit" && id) {
          navigate(-1);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
          setWaiterTypesLoading(false);
        }
      }
    };

    fetchInitialData();

    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, mode, navigate]);

  const getRoleName = (roleValue) => {
    const matchedRole = findRoleByValue(roleValue);
    return getRoleLabel(matchedRole) || String(roleValue || "").trim();
  };

  const isWaiterRole = (roleValue) => {
    return getRoleName(roleValue).toLowerCase().trim() === "waiter";
  };

  const handleOpenAddRoleModal = () => {
    resetRoleModal();
    setIsAddRoleModalOpen(true);
  };

  const handleCloseAddRoleModal = () => {
    if (isAddingRole) return;

    setIsAddRoleModalOpen(false);
    resetRoleModal();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "role" && value === ADD_NEW_ROLE_OPTION_VALUE) {
      handleOpenAddRoleModal();
      return;
    }

    if (name === "phone") {
      const formattedValue = value.replace(/[^0-9]/g, "").slice(0, 10);
      setFormData((prev) => ({ ...prev, phone: formattedValue }));

      if (errors.phone) {
        setErrors((prev) => ({ ...prev, phone: null }));
      }
      return;
    }

    if (name === "role") {
      const selectedIsWaiter = isWaiterRole(value);

      setFormData((prev) => ({
        ...prev,
        role: value,
        waiter_type_id: selectedIsWaiter ? prev.waiter_type_id : "",
      }));

      setErrors((prev) => ({
        ...prev,
        role: null,
        waiter_type_id: null,
      }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleRoleModalChange = (e) => {
    const { name, value } = e.target;

    setRoleModalForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setRoleModalErrors((prev) => ({
      ...prev,
      [name]: null,
      general: null,
    }));
  };

  const handleStaffTypeChange = (e) => {
    const type = e.target.value;

    setFormData((prev) => {
      const updates = { staff_type: type };

      if (type === "Fixed") {
        updates.agency_name = "";
        updates.contract_rate = "";
        updates.per_day_rate = "0.00";
      } else if (type === "Agency") {
        updates.fixed_salary = "";
        updates.contract_rate = "";
      } else if (type === "Contract") {
        updates.fixed_salary = "";
        updates.agency_name = "";
      }

      return { ...prev, ...updates };
    });

    setErrors({});
  };

  const handleAddRoleSubmit = async (e) => {
    e.preventDefault();

    const trimmedName = roleModalForm.name.trim();
    const trimmedDescription = roleModalForm.description.trim();
    const normalizedName = trimmedName.toLowerCase();

    const duplicateRole = rolesList.find(
      (roleObj) => getRoleLabel(roleObj).toLowerCase() === normalizedName
    );

    if (!trimmedName) {
      setRoleModalErrors({ name: "Role name is required" });
      toast.error("Role name is required");
      return;
    }

    if (duplicateRole) {
      setRoleModalErrors({ name: "Role already exists" });
      toast.error("Role already exists");
      return;
    }

    setIsAddingRole(true);

    try {
      const response = await createRole({
        name: trimmedName,
        description: trimmedDescription,
      });
      const addedRole = normalizeEntityResponse(response);

      if (!addedRole) {
        throw new Error("Role response is missing data");
      }

      setRolesList((prev) => {
        const withoutDuplicate = prev.filter(
          (roleObj) => String(roleObj.id) !== String(addedRole.id)
        );
        return [...withoutDuplicate, addedRole];
      });

      const addedRoleName = getRoleLabel(addedRole).toLowerCase();
      setFormData((prev) => ({
        ...prev,
        role: String(addedRole.id || ""),
        waiter_type_id: addedRoleName === "waiter" ? prev.waiter_type_id : "",
      }));

      setErrors((prev) => ({
        ...prev,
        role: null,
        waiter_type_id: null,
      }));

      toast.success("Role added successfully");
      setIsAddRoleModalOpen(false);
      resetRoleModal();
    } catch (error) {
      console.error("Add Role Error:", error);

      const message = getApiErrorMessage(error, "Error creating role");
      const normalizedMessage = message.toLowerCase();
      const duplicateError =
        normalizedMessage.includes("already exists") ||
        normalizedMessage.includes("unique");

      setRoleModalErrors(
        duplicateError
          ? { name: "Role already exists" }
          : { general: message }
      );

      toast.error(duplicateError ? "Role already exists" : message);
    } finally {
      setIsAddingRole(false);
    }
  };

  const handleStatusToggle = () => {
    setFormData((prev) => ({
      ...prev,
      is_active: !prev.is_active,
    }));
  };

  const validateForm = () => {
    const nextErrors = {};

    if (!formData.name.trim()) nextErrors.name = "Name is required";

    if (!formData.phone.trim()) {
      nextErrors.phone = "Phone number is required";
    } else if (!/^\d{10}$/.test(formData.phone)) {
      nextErrors.phone = "Phone number must be exactly 10 digits";
    }

    if (!formData.role || !String(formData.role).trim()) {
      nextErrors.role = "Role is required";
    }

    if (isWaiterRole(formData.role) && !formData.waiter_type_id) {
      nextErrors.waiter_type_id = "Waiter type is required for waiter role";
    }

    if (formData.staff_type === "Fixed") {
      if (!formData.fixed_salary || parseFloat(formData.fixed_salary) <= 0) {
        nextErrors.fixed_salary =
          "Fixed salary is required and must be greater than 0";
      }

      if (!formData.joining_date) {
        nextErrors.joining_date = "Joining Date is required for Fixed Staff";
      }
    } else if (
      !formData.per_day_rate ||
      parseFloat(formData.per_day_rate) <= 0
    ) {
      nextErrors.per_day_rate = "Paid per person rate must be greater than 0";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fill in all required fields correctly");
      return;
    }

    setSaving(true);

    try {
      const payload = { ...formData };
      const selectedIsWaiter = isWaiterRole(payload.role);

      if (selectedIsWaiter) {
        payload.waiter_type = payload.waiter_type_id;
      } else {
        payload.waiter_type = null;
      }
      delete payload.waiter_type_id;

      payload.per_person_rate = payload.per_day_rate || 0;
      delete payload.per_day_rate;

      if (payload.role && Number.isNaN(Number(payload.role))) {
        const searchName = String(payload.role).toLowerCase();
        const matchedRole = rolesList.find((roleObj) => {
          const roleName = getRoleLabel(roleObj).toLowerCase();
          return roleName === searchName || String(roleObj.id) === searchName;
        });

        if (matchedRole?.id) {
          payload.role = matchedRole.id;
        }
      }

      if (payload.staff_type === "Fixed") {
        payload.agency_name = null;
        payload.contract_rate = null;
        payload.per_person_rate = 0;
      } else if (payload.staff_type === "Agency") {
        payload.fixed_salary = null;
        payload.contract_rate = null;
        payload.agency_name = payload.name;
      } else if (payload.staff_type === "Contract") {
        payload.fixed_salary = null;
        payload.agency_name = null;
        payload.contract_rate = null;
      }

      let response;
      if (mode === "add") {
        delete payload.id;
        response = await createStaff(payload);
      } else {
        response = await updateStaff(formData.id, payload);
      }

      if (response && response.status >= 200 && response.status < 300) {
        toast.success(
          mode === "add"
            ? "Staff member added successfully!"
            : "Staff member updated successfully!"
        );
        navigate(-1);
      } else {
        toast.error(
          response?.data?.message || "Operation failed. Please try again."
        );
      }
    } catch (error) {
      console.error("API Error:", error);

      toast.error(
        getApiErrorMessage(
          error,
          `Error ${mode === "add" ? "creating" : "updating"} staff member`
        )
      );

      if (
        error?.response?.data &&
        typeof error.response.data === "object" &&
        !error.response.data.message
      ) {
        const apiErrors = {};

        Object.keys(error.response.data).forEach((key) => {
          apiErrors[key] = Array.isArray(error.response.data[key])
            ? error.response.data[key][0]
            : error.response.data[key];
        });

        setErrors(apiErrors);
      }
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <AddEditStaffComponent
      mode={mode}
      formData={formData}
      loading={loading}
      saving={saving}
      errors={errors}
      rolesList={rolesList}
      waiterTypes={waiterTypes}
      waiterTypesLoading={waiterTypesLoading}
      showWaiterType={isWaiterRole(formData.role)}
      addNewRoleOptionValue={ADD_NEW_ROLE_OPTION_VALUE}
      isAddRoleModalOpen={isAddRoleModalOpen}
      roleModalForm={roleModalForm}
      roleModalErrors={roleModalErrors}
      isAddingRole={isAddingRole}
      handleAddRoleSubmit={handleAddRoleSubmit}
      handleRoleModalChange={handleRoleModalChange}
      handleCloseAddRoleModal={handleCloseAddRoleModal}
      handleChange={handleChange}
      handleStaffTypeChange={handleStaffTypeChange}
      handleStatusToggle={handleStatusToggle}
      handleSubmit={handleSubmit}
      handleCancel={handleCancel}
    />
  );
}

export default AddEditStaffController;
