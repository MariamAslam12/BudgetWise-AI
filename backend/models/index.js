
import mongoose from 'mongoose'

// --------------------------------------------------
// COMPANY
// --------------------------------------------------

const companySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    }
  },
  { timestamps: true }
)

/// --------------------------------------------------
// USER
// --------------------------------------------------

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: true
    },
    role: {
      type: String,
      enum: ['employee', 'finance_manager', 'company_admin'],
      required: true
    },
    department: {
  type: String,
  enum: [
    '',
    'Marketing',
    'Development & IT',
    'Finance',
    'HR',
    'Operations',
    'Sales',
    'Other'
  ],
  default: '',
  required: function () {
    return this.role === 'employee'
  }
},

    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      required: true
    },
    active: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
)
// --------------------------------------------------
// PROJECT
// Projects are created/connected through client invoices.
// --------------------------------------------------

const projectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    clientName: {
      type: String,
      required: true,
      trim: true
    },
    clientEmail: {
      type: String,
      default: '',
      trim: true,
      lowercase: true
    },
    clientPhone: {
      type: String,
      default: '',
      trim: true
    },
    description: {
      type: String,
      default: ''
    },
    budgetAmount: {
      type: Number,
      default: 0,
      min: 0
    },
    status: {
      type: String,
      enum: ['planning', 'active', 'completed', 'on_hold'],
      default: 'active'
    },
    startDate: {
      type: Date,
      default: null
    },
    endDate: {
      type: Date,
      default: null
    },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      required: true
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  { timestamps: true }
)

projectSchema.index({ company: 1, name: 1 })

// --------------------------------------------------
// EXPENSE
// --------------------------------------------------

const expenseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    category: {
      type: String,
      required: true
    },
    department: {
      type: String,
      default: ''
    },
    amount: {
      type: Number,
      required: true,
      min: 0
    },
    description: {
      type: String,
      default: ''
    },
    request: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Request',
      default: null
    },

    // Links an expense to a project when applicable.
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      default: null
    },

    // Links vendor invoice expenses to their original invoice.
    invoice: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Invoice',
      default: null
    },

    // Approval status: managed through Approvals.
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending'
    },

    // Payment status: managed through Expenses.
    paymentStatus: {
      type: String,
      enum: ['unpaid', 'paid'],
      default: 'unpaid'
    },

    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      required: true
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  { timestamps: true }
)

expenseSchema.index(
  { request: 1 },
  {
    unique: true,
    partialFilterExpression: {
      request: { $type: 'objectId' }
    }
  }
)

// One vendor invoice can create only one linked expense.
expenseSchema.index(
  { invoice: 1 },
  {
    unique: true,
    partialFilterExpression: {
      invoice: { $type: 'objectId' }
    }
  }
)

// --------------------------------------------------
// INVOICE
// Supports vendor invoices and client invoices.
// --------------------------------------------------

const invoiceSchema = new mongoose.Schema(
  {
    invoiceNumber: {
      type: String,
      required: true,
      trim: true
    },

    // Old invoices without this field are treated as vendor invoices.
    type: {
      type: String,
      enum: ['vendor', 'client'],
      default: 'vendor'
    },

    // Required for vendor invoices.
    vendor: {
      type: String,
      trim: true,
      required: function () {
        return this.type === 'vendor'
      }
    },

    // Required for client invoices.
    clientName: {
      type: String,
      trim: true,
      required: function () {
        return this.type === 'client'
      }
    },

    clientEmail: {
      type: String,
      default: '',
      trim: true,
      lowercase: true
    },

    amount: {
      type: Number,
      required: true,
      min: 0
    },

    invoiceDate: {
      type: Date,
      default: Date.now
    },

    dueDate: {
      type: Date
    },

    // Client invoices connect to a project.
    // Vendor invoices can optionally connect to one.
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      default: null
    },

    // Vendor invoice -> automatically created expense.
    expense: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Expense',
      default: null
    },
    request: {
  type: mongoose.Schema.Types.ObjectId,
  ref: 'Request',
  default: null
},

    status: {
      type: String,
      enum: ['pending', 'paid', 'overdue'],
      default: 'pending'
    },

    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      required: true
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  { timestamps: true }
)

// --------------------------------------------------
// EMPLOYEE REQUEST
// --------------------------------------------------

const requestSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['expense', 'invoice', 'it_support', 'general', 'issue'],
      required: true
    },
    category: {
      type: String,
      enum: [
        'employee_expenses',
        'utilities',
        'travel',
        'fuel',
        'office_supplies',
        'business_meal',
        'internet',
        'invoice_generation',
        'it_support',
        'equipment',
        'software_access',
        'general'
      ],
      required: true
    },
    title: {
      type: String,
      required: true,
      trim: true
    },
    invoiceType: {
  type: String,
  enum: ['vendor', 'client', ''],
  default: ''
},
vendorName: {
  type: String,
  trim: true,
  default: ''
},
clientName: {
  type: String,
  trim: true,
  default: ''
},
    department: {
  type: String,
  enum: [
    '',
    'Marketing',
    'Development & IT',
    'Finance',
    'HR',
    'Operations',
    'Sales',
    'Other'
  ],
  default: ''
},
    description: {
      type: String,
      default: ''
    },
    amount: {
      type: Number,
      default: 0,
      min: 0
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium'
    },
    status: {
      type: String,
      enum: [
        'pending',
        'in_progress',
        'approved',
        'rejected',
        'resolved'
      ],
      default: 'pending'
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      required: true
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  { timestamps: true }
)

// --------------------------------------------------
// NOTIFICATIONS
// --------------------------------------------------

const notificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },

    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      required: true
    },

    request: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Request',
      default: null
    },

    type: {
      type: String,
      enum: ['request_submitted', 'request_status_updated'],
      required: true
    },

    title: {
      type: String,
      required: true
    },

    message: {
      type: String,
      required: true
    },

    isRead: {
      type: Boolean,
      default: false
    },

    readAt: {
      type: Date,
      default: null
    }
  },
  { timestamps: true }
)

notificationSchema.index({
  recipient: 1,
  company: 1,
  isRead: 1,
  createdAt: -1
})

// --------------------------------------------------
// COMPANY BUDGET
// --------------------------------------------------

const budgetSchema = new mongoose.Schema(
  {
    month: {
      type: String,
      required: true
    },
    type: {
      type: String,
      enum: ['company', 'department', 'category'],
      required: true,
      default: 'company'
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    amount: {
      type: Number,
      required: true,
      min: 0.01
    },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      required: true
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  { timestamps: true }
)

budgetSchema.index(
  { company: 1, month: 1, type: 1, name: 1 },
  { unique: true }
)

// --------------------------------------------------
// INCOME
// Client invoice payments can automatically create income.
// --------------------------------------------------

const incomeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    amount: {
      type: Number,
      required: true,
      min: 0.01
    },
    description: {
      type: String,
      default: ''
    },
    receivedAt: {
      type: Date,
      default: Date.now
    },

    // Links automatically recorded income to its client invoice.
    invoice: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Invoice',
      default: null
    },

    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      required: true
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  { timestamps: true }
)

// Prevent duplicate income records for the same client invoice.
incomeSchema.index(
  { invoice: 1 },
  {
    unique: true,
    partialFilterExpression: {
      invoice: { $type: 'objectId' }
    }
  }
)

// --------------------------------------------------
// EXPORT MODELS
// --------------------------------------------------

export const Company = mongoose.model('Company', companySchema)
export const User = mongoose.model('User', userSchema)
export const Project = mongoose.model('Project', projectSchema)
export const Expense = mongoose.model('Expense', expenseSchema)
export const Invoice = mongoose.model('Invoice', invoiceSchema)
export const Request = mongoose.model('Request', requestSchema)
export const Notification = mongoose.model(
  'Notification',
  notificationSchema
)
export const Budget = mongoose.model('Budget', budgetSchema)
export const Income = mongoose.model('Income', incomeSchema)
