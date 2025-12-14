import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

const Breadcrumbs = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  // Don't show breadcrumbs on the landing page
  if (location.pathname === '/') {
    return null;
  }

  const breadcrumbNameMap: { [key: string]: string } = {
    'dashboard': 'Dashboard',
    'login': 'Login',
    'register': 'Register',
    'profile': 'Student Profile',
    'apply': 'Apply',
    'manage-applications': 'Manage Applications',
    'manage-courses': 'Manage Courses',
    'create-course': 'Create Course',
    'courses': 'Courses',
    'my-courses': 'My Courses',
    'departments': 'Departments',
    'manage-departments': 'Manage Departments',
    'create-department': 'Create Department',
    'manage-gpa': 'Manage GPA',
    'blog': 'Blog',
    'services': 'Services',
  };

  return (
    <nav className="bg-gray-50 border-b border-gray-200 px-6 py-3" aria-label="Breadcrumb">
      <ol className="max-w-7xl mx-auto flex items-center space-x-2">
        <li>
          <div>
            <Link to="/" className="text-gray-400 hover:text-gray-500">
              <Home className="h-5 w-5 flex-shrink-0" aria-hidden="true" />
              <span className="sr-only">Home</span>
            </Link>
          </div>
        </li>
        {pathnames.map((value, index) => {
          const to = `/${pathnames.slice(0, index + 1).join('/')}`;
          const isLast = index === pathnames.length - 1;
          
          // Decode URI component to handle spaces/special chars in params like courseTitle
          const decodedValue = decodeURIComponent(value);
          
          // Use mapped name if available, otherwise format the path segment
          const displayName = breadcrumbNameMap[value] || 
            decodedValue.charAt(0).toUpperCase() + decodedValue.slice(1).replace(/-/g, ' ');

          return (
            <li key={to}>
              <div className="flex items-center">
                <ChevronRight className="h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true" />
                {isLast ? (
                  <span className="ml-2 text-sm font-medium text-gray-700" aria-current="page">
                    {displayName}
                  </span>
                ) : (
                  <Link
                    to={to}
                    className="ml-2 text-sm font-medium text-gray-500 hover:text-gray-700"
                  >
                    {displayName}
                  </Link>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
