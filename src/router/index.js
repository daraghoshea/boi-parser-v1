import Vue from 'vue';
import Router from 'vue-router';

// import HomeView from '../views/Home'
import BankAccountsView from '../views/accounts/BankAccounts'
import BankAccountEditView from "../views/accounts/BankAccountEdit"
import BankAccountNewView from "../views/accounts/BankAccountNew"
import ContactsView from '../views/Contacts'
import ContactEditView from "../views/ContactEdit"
import ContactNewView from "../views/ContactNew"
import CreditsView from '../views/Credits'
import CategoriesView from '../views/Categories'
import DebitsView from '../views/Debits'
import EmptyNestedLayout from '../layouts/EmptyNestedLayout'
import FilesView from '../views/Files'
import FilesList from '../views/FilesList'
import FilesUpload from '../views/FilesUpload'
import InvoicesView from "../views/Invoices";
import InvoiceNewView from "../views/InvoiceNew"
import InvoiceEditView from "../views/InvoiceEdit"
import BankStatementPdfUpload from "../views/accounts/BankStatementPdfUpload";
import BankStatements from "../views/accounts/BankStatements";

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/',
            component: FilesUpload,
            redirect: {name: 'accounts'}
        },
        {
            path: '/files',
            component: FilesView,
            children: [
                {
                    path: "",
                    component: FilesList
                },
                {
                    path: 'upload',
                    component: FilesUpload,
                }
            ]
        },
        {
            path: '/transactions',
            component: EmptyNestedLayout,
            redirect: {name: 'transactions.debits'},
            children: [
                {
                    path: "expenditure",
                    component: DebitsView,
                    name: "transactions.debits"
                },
                {
                    path: 'income',
                    component: CreditsView,
                    name: "transactions.credits"
                },
                {
                    path: 'categories',
                    component: CategoriesView,
                    name: "transactions.categories"
                }
            ]
        },
        {
            path: '/contacts',
            component: EmptyNestedLayout,
            children: [
                {
                    path: "",
                    component: ContactsView,
                    name: 'contacts'
                },
                {
                    path: "new",
                    component: ContactNewView,
                    name: 'contacts.new'
                },
                {
                    path: ":id/edit",
                    component: ContactEditView,
                    name: 'contacts.edit'
                }
            ]
        },
        {
            path: '/invoices',
            component: EmptyNestedLayout,
            children: [
                {
                    path: '',
                    component: InvoicesView,
                    name: 'invoices'
                },
                {
                    path: 'new',
                    component: InvoiceNewView,
                    name: 'invoices.new'
                },
                {
                    path: ":id/edit",
                    component: InvoiceEditView,
                    name: 'invoices.edit'
                }
            ]
        },
        {
            path: '/accounts',
            component: EmptyNestedLayout,
            children: [
                {
                    path: '',
                    component: BankAccountsView,
                    name: 'accounts'
                },
                {
                    path: "statements",
                    component: BankStatements,
                    name: "accounts.statements"
                },
                {
                    path: 'new',
                    component: BankAccountNewView,
                    name: 'accounts.new'
                },
                {
                    path: ":id/edit",
                    component: BankAccountEditView,
                    name: 'accounts.edit'
                },
                {
                    path: ":id/statement/upload",
                    component: BankStatementPdfUpload,
                    name: "accounts.upload"
                }
            ]
        },
    ],
});