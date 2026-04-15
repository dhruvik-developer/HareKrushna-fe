import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import "./index.css";
import PrivateRoute from "./routes/PrivateRoute";
import Layout from "./Components/layout/Layout";
import { UserProvider } from "./context/UserContext";

import { Login } from "./pages/login";
import { Dish } from "./pages/dish";
import { Category } from "./pages/category";
import { Quotation } from "./pages/quotation";
import { Invoice } from "./pages/invoice";
import { AllOrder } from "./pages/allOrder";
import { StockManagement } from "./pages/stock";
import { PaymentHistory } from "./pages/paymentHistory";
import { RecipeIngredient } from "./pages/recipeIngredient";
import { CreateIngredient } from "./pages/createIngredient";
import { ViewIngredient } from "./pages/viewIngredient";
import { ViewOrderDetails } from "./pages/viewOrderDetails";
import { ShareIngredient } from "./pages/shareIngredient";
import { User } from "./pages/user";
import { Expense } from "./pages/expense";
import { Calendar } from "./pages/calendar";
import { ViewItemRecipe } from "./pages/itemRecipe";
import { Vendor } from "./pages/vendor";
// import GstBillingModule from "./pages/gstBilling/GstBillingModule";
import { SessionChecklistPreview } from "./pages/sessionChecklistPreview";
import { PeoplePage } from "./pages/people";

import { Rules } from "./Components/common/rules";

import { EditDish } from "./pages/editOrder/editDish";
import { EditItem } from "./pages/editOrder/editItem";

import { AddItem } from "./Components/category/addItem";
import { AddCategory } from "./Components/category/addCategory";
import { AddIngredient } from "./Components/recipeIngredient/addRecipe";
import { EditIngredient } from "./Components/recipeIngredient/editRecipe";
import { AddIngredientItem } from "./Components/ingredient/addIngredient";
import { AddEditVendor } from "./Components/vendor/addEditVendor";

import PDFViewPage from "./Components/common/pdfPages/dishPdf/PdfView";
import { PDFEditDish } from "./Components/common/pdfPages/editDishPdf";
import { PDFAllOrder } from "./Components/common/pdfPages/allOrderPdf/viewOrderPdf";
import { PDFShareAllOrder } from "./Components/common/pdfPages/allOrderPdf/shareOrderPdf";
import { PDFShareIngredient } from "./Components/common/pdfPages/allOrderPdf/shareIngredientPdf";
import { PDFQuotation } from "./Components/common/pdfPages/quotationPdf";
import { PDFInvoice } from "./Components/common/pdfPages/invoicePdf/invoiceOrder";
import { PDFBillInvoice } from "./Components/common/pdfPages/invoicePdf/invoiceBill";
import { CompleteInvoice } from "./Components/completeInvoice";
import { PDFShareFullIngredient } from "./Components/common/pdfPages/allOrderPdf/shareFullIngredientPdf";
import PdfShareOutsourcedController from "./Components/common/pdfPages/allOrderPdf/shareOutsourcedPdf/PdfShareOutsourcedController";
import ShareOutsourcedController from "./pages/shareOutsourced/ShareOutsourcedController";
import { AddEditUser } from "./Components/user/addEditUser";
import { BASE_PATH } from "./utils/Config";
import DishTagPdf from "./Components/common/pdfPages/dishTagPdf/DishTagPdf";

// Event Staff Module
import StaffController from "./pages/eventStaff/staff/StaffController";
import AddEditStaffController from "./pages/eventStaff/staff/AddEditStaffController";
import AssignmentController from "./pages/eventStaff/assignment/AssignmentController";
import AddEditAssignmentController from "./pages/eventStaff/assignment/AddEditAssignmentController";
import EventSummaryController from "./pages/eventStaff/reports/EventSummaryController";
import StaffDetailPage from "./pages/eventStaff/reports/StaffDetailPage";
import FixedStaffPaymentController from "./pages/eventStaff/reports/FixedStaffPaymentController";
import WaiterTypeManagement from "./pages/eventStaff/WaiterTypeManagement";
import SettingsController from "./pages/settings/SettingsController";

// Ground Management Module
import GroundCategoryMaster from "./pages/ground/categories/GroundCategoryMaster";
import GroundItemMaster from "./pages/ground/items/GroundItemMaster";
import EventGroundChecklist from "./pages/ground/checklist/EventGroundChecklist";

const App = () => (
  <UserProvider>
    <Router basename={BASE_PATH}>
      <Toaster position="top-center" reverseOrder={false} />
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route element={<PrivateRoute />}>
          <Route element={<Layout />}>
            {/* All main routes */}
            <Route path="/dish" element={<Dish />} />
            <Route path="/category" element={<Category />} />
            <Route path="/quotation" element={<Quotation />} />
            <Route path="/all-order" element={<AllOrder />} />
            <Route path="/invoice" element={<Invoice />} />
            <Route path="/stock" element={<StockManagement />} />
            <Route path="/payment-history" element={<PaymentHistory />} />
            <Route path="/recipe-ingredient" element={<RecipeIngredient />} />
            <Route
              path="/create-recipe-ingredient"
              element={<CreateIngredient />}
            />
            <Route path="/view-ingredient/:id" element={<ViewIngredient />} />
            <Route
              path="/view-order-details/:id"
              element={<ViewOrderDetails />}
            />
            <Route
              path="/session-checklist-preview/:eventId/:sessionId"
              element={<SessionChecklistPreview />}
            />
            <Route path="/share-ingredient" element={<ShareIngredient />} />
            <Route path="/share-outsourced" element={<ShareOutsourcedController />} />
            <Route path="/user" element={<User />} />
            <Route path="/expense" element={<Expense />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/item-recipe/:itemId" element={<ViewItemRecipe />} />
            {/* <Route path="/gst-billing" element={<GstBillingModule />} /> */}
            <Route path="/people" element={<PeoplePage />}>
              <Route index element={<Navigate to="event-staff" replace />} />
              <Route path="event-staff" element={<StaffController />} />
              <Route path="vendor" element={<Vendor />} />
              <Route
                path="waiter-types"
                element={<WaiterTypeManagement />}
              />
            </Route>
            {/* End of all main routes */}

            {/* Add & edit user and rule route */}
            <Route path="/add-user" element={<AddEditUser />} />
            <Route path="/edit-user/:id" element={<AddEditUser />} />
            <Route path="/add-rule" element={<Rules />} />
            {/* End of add & edit user and rule route */}

            {/* Add & edit vendor route */}
            <Route path="/add-vendor" element={<AddEditVendor />} />
            <Route path="/edit-vendor/:id" element={<AddEditVendor />} />
            {/* End of add & edit vendor route */}

            {/* Legacy People entry routes */}
            <Route
              path="/event-staff"
              element={<Navigate to="/people/event-staff" replace />}
            />
            <Route
              path="/vendor"
              element={<Navigate to="/people/vendor" replace />}
            />
            <Route
              path="/waiter-types"
              element={<Navigate to="/people/waiter-types" replace />}
            />
            {/* End of legacy People entry routes */}

            {/* Event Staff Routes */}
            <Route path="/add-staff" element={<AddEditStaffController />} />
            <Route
              path="/edit-staff/:id"
              element={<AddEditStaffController />}
            />
            <Route
              path="/event-assignments"
              element={<AssignmentController />}
            />
            <Route
              path="/add-assignment"
              element={<AddEditAssignmentController />}
            />
            <Route
              path="/edit-assignment/:id"
              element={<AddEditAssignmentController />}
            />
            <Route path="/event-summary" element={<EventSummaryController />} />
            <Route
              path="/staff-detail/:staffId"
              element={<StaffDetailPage />}
            />
            <Route
              path="/fixed-staff-payments/:staffId"
              element={<FixedStaffPaymentController />}
            />
            {/* End Event Staff Routes */}

            {/* Settings */}
            <Route path="/settings" element={<SettingsController />} />

            {/* Ground Management */}
            <Route path="/ground-categories" element={<GroundCategoryMaster />} />
            <Route path="/ground-items" element={<GroundItemMaster />} />
            <Route path="/ground-checklist" element={<EventGroundChecklist />} />

            {/* Edit order routes */}
            <Route path="/edit-dish/:id" element={<EditDish />} />
            <Route path="/edit-item" element={<EditItem />} />
            {/* End of edit order routes */}

            {/* Add categories & items routes */}
            <Route path="/create-category" element={<AddCategory />} />
            <Route path="/create-item" element={<AddItem />} />
            <Route path="/create-ingredient" element={<AddIngredient />} />
            <Route path="/edit-ingredient/:id" element={<EditIngredient />} />
            <Route
              path="/add-ingredient-item"
              element={<AddIngredientItem />}
            />
            {/* End of add categories & items routes */}

            {/* All PDF routes */}
            <Route path="/pdf" element={<PDFViewPage />} />
            <Route path="/edit-order-pdf" element={<PDFEditDish />} />
            <Route path="/order-pdf/:id" element={<PDFAllOrder />} />
            <Route path="/share-order-pdf/:id" element={<PDFShareAllOrder />} />
            <Route
              path="/share-ingredient-pdf"
              element={<PDFShareIngredient />}
            />
            <Route
              path="/share-outsourced-pdf"
              element={<PdfShareOutsourcedController />}
            />
            <Route
              path="/share-full-ingredient-pdf"
              element={<PDFShareFullIngredient />}
            />
            <Route path="/quotation-pdf/:id" element={<PDFQuotation />} />
            <Route path="/invoice-order-pdf/:id" element={<PDFInvoice />} />
            <Route path="/invoice-bill-pdf/:id" element={<PDFBillInvoice />} />
            <Route
              path="/complete-invoice-pdf/:id"
              element={<CompleteInvoice />}
            />
            <Route path="/dish-tags-pdf" element={<DishTagPdf />} />
            {/* End of all PDF routes */}
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  </UserProvider>
);

export default App;
