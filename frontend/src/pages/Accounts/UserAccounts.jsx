import UsersTable from '../../components/tables/UserTables/User.tsx';
import { Modal } from '../../components/ui/modal'; // adjust path as needed
import Input from '../../components/form/input/InputField';
import Label from '../../components/form/Label';
import Button from '../../components/ui/button/Button';
import Select from '../../components/form/Select.tsx';
import LoadingSpinner from '../../components/ui/spinner/LoadingSpinner';
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from '../../components/common/PageMeta';
import { toast } from 'react-toastify';
import { useUserAccount } from '../../hooks/useUserAccount';

export default function UserAccounts() {
  const {
    isOpen,
    openModal,
    closeModal,
    searchTerm,
    setSearchTerm,
    selectedRole,
    setSelectedRole,
    isLoading,
    options,
    newUser,
    setNewUser,
    handleAddUser,
    error,
  } = useUserAccount();

  if (isLoading) return <div><LoadingSpinner/></div>

  return (
    <div className="App">
      <PageMeta
        title="SoilSnap | Accounts"
        description="SoilSnap accounts management page"
      />
      <PageBreadcrumb pageTitle="Accounts" />
      <header className="mb-5 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4">
        <div className="block flex-1 min-w-0">
          <div className="relative">
            {/* Search Input */}
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-10 sm:h-11 w-full rounded-lg px-3 sm:px-4 border border-gray-300 dark:border-gray-600 sm:max-w-none xl:w-[430px] dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-success-500 focus:border-transparent placeholder:text-gray-500 text-sm sm:text-base"
            />
          </div>
        </div>
        <button 
          className="px-3 sm:px-4 py-2 sm:py-3 bg-success-500 rounded-lg sm:rounded-xl text-white hover:bg-success-600 transition-colors text-sm sm:text-base font-medium whitespace-nowrap flex-shrink-0" 
          onClick={openModal}
        >
          Add Account
        </button>
      </header>

      <UsersTable searchTerm={searchTerm} />
      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] m-4">
        <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
          <div className="px-2 pr-14">
            <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
              Add Account
            </h4>
            <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
              Fill up the form to add a new account.
            </p>
          </div>
          <form className="flex flex-col">
            <div className="custom-scrollbar h-[450px] overflow-y-auto px-2 pb-3">

              <div className="mt-7">
                <h5 className="mb-5 text-lg font-medium text-gray-800 dark:text-white/90 lg:mb-6">
                  Personal Information
                </h5>
                <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                  <div className="col-span-2">
                    <Label>First Name</Label>
                    <Input type="text"
                      name='firstname'
                      value={newUser.firstname}
                      onChange={(e) => setNewUser({ ...newUser, firstname: e.target.value })}
                      hint={error.firstname}
                      error={!!error.firstname}
                    />
                  </div>
                  <div className="col-span-2">
                    <Label>Middle Name</Label>
                    <Input type="text"  
                      name='middlename'
                      value={newUser.middlename}
                      onChange={(e) => setNewUser({ ...newUser, middlename: e.target.value })}
                      hint={error.middlename}
                      error={!!error.middlename}
                    />
                  </div>
                  <div className="col-span-2">
                    <Label>Last Name</Label>
                    <Input type="text"  
                      name='lastname'
                      value={newUser.lastname}
                      onChange={(e) => setNewUser({ ...newUser, lastname: e.target.value })}
                      hint={error.lastname}
                      error={!!error.lastname}
                    />
                  </div>
                  <div className="col-span-2">
                    <Label>Email</Label>
                    <Input type="text" 
                      name='email'
                      value={newUser.email}
                      onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                      hint={error.email}
                      error={!!error.email}
                    />
                  </div>
                  <div className="col-span-2">
                    <Label>Password</Label>
                    <Input type="password" 
                      name='password'
                      value={newUser.password}
                      onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                      hint={error.password}
                      error={!!error.password}
                    />
                  </div>
                  <div className="col-span-2">
                   <Label>Select Role</Label>
                    <Select
                      options={options}
                      className="dark:bg-dark-900"
                      name='role'
                      value={newUser.role}
                      hint={error.role}
                      error={!!error.role}
                      onChange={(value) => {
                        setSelectedRole(value);
                        setNewUser({ ...newUser, role: value });
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
              <Button size="sm" variant="outline" onClick={closeModal}>
                Close
              </Button>
              <Button size="sm" onClick={handleAddUser}>
                Save Changes
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
}
