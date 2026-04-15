/* eslint-disable react/prop-types */
import { useState } from "react";
import Input from "../../common/formInputs/Input";
import { FiArrowLeft, FiTruck, FiPlus, FiTag } from "react-icons/fi";
import { FaTimes } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

function AddEditVendorComponent({
  navigate,
  mode,
  form,
  errors,
  vendorCategories,
  vendorMenuCategories = [],
  availableCategories,
  categoryModuleData = [],
  onInputChange,
  onSubmit,
  handleCategoryChange,
  handleRemoveCategory,
  handleAddCategoryRow,
  handleMenuCategoryChange,
  handleRemoveMenuCategory,
  handleAddMenuCategoryRow,
}) {
  const isEdit = mode === "edit";

  // Get list of already-selected category IDs (to prevent duplicates)
  const selectedCategoryIds = vendorCategories
    .filter((vc) => vc.category)
    .map((vc) => Number(vc.category));

  // Get list of already-selected menu category IDs
  const selectedMenuCategoryIds = vendorMenuCategories
    .filter((vc) => vc.category)
    .map((vc) => Number(vc.category));

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg w-auto mx-auto mt-10">
      <button
        type="button"
        className="px-4 py-2 mb-4 font-medium bg-gray-100 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-200 transition-colors flex items-center gap-2 text-sm text-gray-600"
        onClick={() => navigate(-1)}
      >
        <FiArrowLeft size={16} /> Back
      </button>

      <div className="flex items-center gap-3 mb-6">
        <div className="p-2.5 rounded-xl bg-[#f4effc]">
          <FiTruck className="text-[#845cbd]" size={22} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            {isEdit ? "Edit Vendor" : "Add Vendor"}
          </h2>
          <p className="text-sm text-gray-400">
            {isEdit ? "Update vendor details" : "Register a new vendor"}
          </p>
        </div>
      </div>

      <form onSubmit={onSubmit} className="space-y-5">
        {/* Vendor Name */}
        <div>
          <Input
            label="Vendor Name *"
            type="text"
            placeholder="Enter vendor name"
            name="name"
            value={form.name}
            className={`w-full p-2.5 border ${errors.name ? "border-red-400" : "border-gray-300"} rounded-lg focus:outline-none focus:ring-2 focus:ring-[#845cbd]/30 focus:border-[#845cbd] transition-all`}
            onChange={onInputChange}
          />
          {errors.name && (
            <p className="text-xs text-red-500 mt-1">{errors.name}</p>
          )}
        </div>

        {/* Mobile Number */}
        <div>
          <Input
            label="Mobile Number"
            type="text"
            placeholder="Enter mobile number"
            name="mobile_no"
            value={form.mobile_no}
            className="w-full p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#845cbd]/30 focus:border-[#845cbd] transition-all"
            onChange={onInputChange}
          />
        </div>

        {/* Address */}
        <div>
          <label className="block text-black-700 font-medium">Address</label>
          <textarea
            name="address"
            value={form.address}
            onChange={onInputChange}
            placeholder="Enter vendor address"
            rows={3}
            className="w-full p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#845cbd]/30 focus:border-[#845cbd] transition-all resize-none mt-1"
          />
        </div>

        {/* Active Status */}
        <div className="flex items-center gap-3">
          <label className="block text-black-700 font-medium">
            Active Status
          </label>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              name="is_active"
              checked={form.is_active}
              onChange={onInputChange}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#845cbd]/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#845cbd]"></div>
            <span className="ml-2 text-sm text-gray-600">
              {form.is_active ? "Active" : "Inactive"}
            </span>
          </label>
        </div>

        {/* Vendor Categories Section (Ingredients) */}
        <div className="border-t border-gray-100 pt-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-gray-700">Vendor Categories</h3>
              <span className="text-xs text-gray-400">
                (Link ingredient categories with optional pricing)
              </span>
            </div>
            {vendorCategories.length === 0 && (
              <button
                type="button"
                onClick={handleAddCategoryRow}
                className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-[#845cbd] bg-[#f4effc] rounded-lg hover:bg-[#e8ddf5] transition-colors cursor-pointer"
              >
                <FiPlus size={14} /> Add Category
              </button>
            )}
          </div>

          <AnimatePresence>
            {vendorCategories.map((vc, index) => {
              const isLastEmptyRow =
                index === vendorCategories.length - 1 && !vc.category;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="flex items-center gap-2 mb-2"
                >
                  <select
                    value={vc.category}
                    onChange={(e) =>
                      handleCategoryChange(index, "category", e.target.value)
                    }
                    className="flex-1 p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#845cbd]/30 focus:border-[#845cbd] transition-all bg-white"
                  >
                    <option value="">Select Category</option>
                    {availableCategories.map((cat) => (
                      <option
                        key={cat.id}
                        value={cat.id}
                        disabled={
                          selectedCategoryIds.includes(cat.id) &&
                          Number(vc.category) !== cat.id
                        }
                      >
                        {cat.name}
                      </option>
                    ))}
                  </select>
                  <input
                    type="text"
                    value={vc.price}
                    onChange={(e) =>
                      handleCategoryChange(
                        index,
                        "price",
                        e.target.value.replace(/[^0-9.]/g, "")
                      )
                    }
                    placeholder="Price (₹)"
                    className={`w-[130px] p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-200 focus:border-green-500 transition-all ${vc.price ? "text-[#845cbd] font-semibold" : ""}`}
                  />
                  {!isLastEmptyRow ? (
                    <button
                      type="button"
                      className="p-2.5 bg-red-400 text-white rounded-lg cursor-pointer hover:bg-red-500 transition-colors"
                      onClick={() => handleRemoveCategory(index)}
                    >
                      <FaTimes size={16} />
                    </button>
                  ) : (
                    <div className="w-[42px]" />
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Menu Categories Section (Category Module) */}
        <div className="border-t border-gray-100 pt-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-gray-700">Category Module</h3>
              <span className="text-xs text-gray-400">
                (Link menu dish categories with optional pricing)
              </span>
            </div>
            {vendorMenuCategories.length === 0 && (
              <button
                type="button"
                onClick={handleAddMenuCategoryRow}
                className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-[#845cbd] bg-[#f4effc] rounded-lg hover:bg-[#e8ddf5] transition-colors cursor-pointer"
              >
                <FiPlus size={14} /> Add Category Module
              </button>
            )}
          </div>

          <AnimatePresence>
            {vendorMenuCategories.map((vc, index) => {
              const isLastEmptyRow =
                index === vendorMenuCategories.length - 1 && !vc.category;
              
              const selectedMenuCategory = categoryModuleData.find(
                (cat) => cat.id === Number(vc.category)
              );
              
              return (
                <motion.div
                  key={`menu-${index}`}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="flex flex-col gap-2 mb-4 bg-gray-50/50 p-3 rounded-xl border border-gray-100"
                >
                  <div className="flex items-center gap-2">
                    <select
                      value={vc.category}
                      onChange={(e) =>
                        handleMenuCategoryChange(index, "category", e.target.value)
                      }
                      className="flex-1 p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#845cbd]/30 focus:border-[#845cbd] transition-all bg-white"
                    >
                      <option value="">Select Category Module</option>
                      {categoryModuleData.map((cat) => (
                        <option
                          key={cat.id}
                          value={cat.id}
                          disabled={
                            selectedMenuCategoryIds.includes(cat.id) &&
                            Number(vc.category) !== cat.id
                          }
                        >
                          {cat.name}
                        </option>
                      ))}
                    </select>
                    <input
                      type="text"
                      value={vc.price}
                      onChange={(e) =>
                        handleMenuCategoryChange(
                          index,
                          "price",
                          e.target.value.replace(/[^0-9.]/g, "")
                        )
                      }
                      placeholder="Price (₹)"
                      className={`w-[130px] p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-200 focus:border-green-500 transition-all ${vc.price ? "text-[#845cbd] font-semibold" : ""}`}
                    />
                    {!isLastEmptyRow ? (
                      <button
                        type="button"
                        className="p-2.5 bg-red-400 text-white rounded-lg cursor-pointer hover:bg-red-500 transition-colors"
                        onClick={() => handleRemoveMenuCategory(index)}
                      >
                        <FaTimes size={16} />
                      </button>
                    ) : (
                      <div className="w-[42px]" />
                    )}
                  </div>
                  
                  {/* Category Items List Preview */}
                  {selectedMenuCategory && selectedMenuCategory.items && selectedMenuCategory.items.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2 ml-1">
                      <span className="text-xs font-semibold text-gray-500 self-center mr-2 uppercase tracking-wider">
                        Category Items:
                      </span>
                      {selectedMenuCategory.items.map((item) => (
                        <div 
                          key={item.id} 
                          className="flex items-center gap-1.5 px-2.5 py-1 bg-white border border-gray-200 rounded-md text-xs text-gray-700 shadow-sm"
                        >
                          <FiTag className="text-[#845cbd]" size={10} />
                          {item.name}
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Submit Button */}
        <div className="flex items-center justify-center pt-3">
          <button
            type="submit"
            className="px-8 py-2.5 bg-[#845cbd] hover:bg-[#7350a8] text-white font-semibold rounded-lg cursor-pointer shadow-md shadow-[#845cbd]/20 transition-all active:scale-[0.98]"
          >
            {isEdit ? "Update Vendor" : "Save Vendor"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddEditVendorComponent;
