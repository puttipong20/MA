import { Navigate, useLocation } from 'react-router-dom'
import Work from '../Page/Work'
import Login from '../Page/Login'
import Layout from '../Component/Layout'
import FormWork from '../Component/FormWork'
import FormCompany from '../Component/FormCompany'
import Company from '../Page/Company'
import NewCompany from '../Page/Company/new'
import EditCompany from '../Page/Company/edit'
// import Employee from '../Page/Employee'
// import FormEmployee from '../Component/FormEmployee'
// import NewEmployee from '../Page/Employee/new'
// import EditEmployee from '../Page/Employee/edit'
// import ViweEmployee from '../Page/Employee/view'
import ViweCompany from '../Page/Company/view'
import ViweProject from '../Page/Work/view'
import { useAppContext } from '../Context/appcontext'

function RequiredAuth({ children, user }) {
  const location = useLocation()
  if (!user) {
    return <Navigate to='/login' state={{ from: location }} replace />
  }

  return children
}
function useStoreRoute() {
  const { user } = useAppContext()

  const routes = [
    {
      path: '/',
      element: (
        <RequiredAuth user={user}>
          <Layout user={user}>
            <Company user={user} />
          </Layout>
        </RequiredAuth>
      ),
    },
    {
      path: '/home',
      element: (
        <RequiredAuth user={user}>
          <Layout user={user}>
            <Company user={user} />
          </Layout>
        </RequiredAuth>
      ),
    },
    {
      path: '/company',
      element: (
        <RequiredAuth user={user}>
          <Layout user={user}>
            <Company user={user} />
          </Layout>
        </RequiredAuth>
      ),
    },
    {
      path: '/newCompany',
      element: (
        <RequiredAuth user={user}>
          <Layout user={user}>
            <NewCompany user={user} />
          </Layout>
        </RequiredAuth>
      ),
    },
    {
      path: '/formCompany',
      element: (
        <RequiredAuth user={user}>
          <Layout user={user}>
            <FormCompany user={user} />
          </Layout>
        </RequiredAuth>
      ),
    },
    {
      path: '/work',
      element: (
        <RequiredAuth>
          {' '}
          user={user}
          <Layout user={user}>
            <Work user={user} />
          </Layout>
        </RequiredAuth>
      ),
    },
    {
      path: '/work/:id',
      element: (
        <RequiredAuth user={user}>
          <Layout user={user}>
            <Work user={user} />
          </Layout>
        </RequiredAuth>
      ),
    },
    {
      path: '/login',
      element: <Login />,
    },

    {
      path: '/formWork',
      element: (
        <RequiredAuth user={user}>
          <FormWork user={user} />
        </RequiredAuth>
      ),
    },
    {
      path: '/formWork/:id/:Pid',
      element: (
        <RequiredAuth user={user}>
          <FormWork user={user} />
        </RequiredAuth>
      ),
    },
    {
      path: '/editCompany/:id',
      element: (
        <RequiredAuth user={user}>
          <Layout user={user}>
            <EditCompany user={user} />
          </Layout>
        </RequiredAuth>
      ),
    },
    // {
    //   path: '/employee',
    //   element: (
    //     <RequiredAuth user={user}>
    //       <Layout user={user}>
    //         <Employee user={user} />
    //       </Layout>
    //     </RequiredAuth>
    //   ),
    // },
    // {
    //   path: '/formEmployee',
    //   element: (
    //     <RequiredAuth user={user}>
    //       <Layout user={user}>
    //         <FormEmployee user={user} />
    //       </Layout>
    //     </RequiredAuth>
    //   ),
    // },
    // {
    //   path: '/newEmployee',
    //   element: (
    //     <RequiredAuth user={user}>
    //       <Layout user={user}>
    //         <NewEmployee user={user} />
    //       </Layout>
    //     </RequiredAuth>
    //   ),
    // },
    // {
    //   path: '/editEmployee/:id',
    //   element: (
    //     <RequiredAuth user={user}>
    //       <Layout user={user}>
    //         <EditEmployee user={user} />
    //       </Layout>
    //     </RequiredAuth>
    //   ),
    // },
    // {
    //   path: '/viweEmployee/:id',
    //   element: (
    //     <RequiredAuth user={user}>
    //       <Layout user={user}>
    //         <ViweEmployee user={user} />
    //       </Layout>
    //     </RequiredAuth>
    //   ),
    // },
    {
      path: '/viweCompany/:id',
      element: (
        <RequiredAuth user={user}>
          <Layout user={user}>
            <ViweCompany user={user} />
          </Layout>
        </RequiredAuth>
      ),
    },
    {
      path: '/viweProject/:id',
      element: (
        <RequiredAuth user={user}>
          <Layout user={user}>
            <ViweProject user={user} />
          </Layout>
        </RequiredAuth>
      ),
    },
    {
      path: '*',
      element: <Navigate to={'/'} />,
    },
  ]
  return { routes }
}
export default useStoreRoute

// import { Navigate, useLocation } from "react-router-dom"
// import Work from "../Page/Work";
// import Login from "../Page/Login";
// import { useAuth } from "../Hooks";
// import Layout from "../Component/Layout";
// import FormWork from "../Component/FormWork";
// import NewWork from "../Page/Work/New";
// import EditWork from "../Page/Work/Edit";
// import FormCompany from "../Component/FormCompany";
// import Company from "../Page/Company";
// import NewCompany from "../Page/Company/new";
// import EditCompany from "../Page/Company/edit";
// function RequiredAuth({
//     children
//     , user
// }) {
//     const location = useLocation()
//     if (!user) {
//         return <Navigate to='/Login' state={{ from: location }} replace />
//     }

//     return children

// }
// function useStoreRoute() {

//     const { user } = useAuth()
//     const route = [
// {
//     path: "/",
//     element: (
//         <RequiredAuth >
//             <Layout >
//                 <Company />
//             </Layout>
//         </RequiredAuth>
//     )
// },
// {
//     path: "/NewCompany",
//     element: (
//         <RequiredAuth>
//             <Layout>
//                 <NewCompany />
//             </Layout>
//         </RequiredAuth>
//     )
// },
// {
//     path: "/FormCompany",
//     element: (
//         <RequiredAuth>
//             <Layout>
//                 <FormCompany />
//             </Layout>
//         </RequiredAuth>
//     )
// },
// {
//     path: "/Work",
//     element: (
//         <RequiredAuth>
//             <Layout>
//                 <Work />
//             </Layout>
//         </RequiredAuth>
//     )
// },
// {
//     path: "/Work/:id",
//     element: (
//         <RequiredAuth>
//             <Layout>
//                 <Work />
//             </Layout>
//         </RequiredAuth>
//     )
// },
// {
//     path: "/Login",
//     element: (
//         <Login />
//     )
// },

// {
//     path: "/FormWork",
//     element: (
//         <RequiredAuth>
//             <FormWork />
//         </RequiredAuth>
//     )
// },
// {
//     path: "/FormWork/:id/:Pid",
//     element: (
//         <RequiredAuth>
//             <FormWork />
//         </RequiredAuth>
//     )
// },
// {
//     path: "/NewWork",
//     element: (
//         <RequiredAuth>
//             <NewWork />
//         </RequiredAuth>
//     )
// },
// {
//     path: "/EditWork/:id",
//     element: (
//         <RequiredAuth>
//             <EditWork />
//         </RequiredAuth>
//     )
// },
// {
//     path: "/EditCompany/:id",
//     element: (
//         <RequiredAuth>
//             <Layout>

//                 <EditCompany />
//             </Layout>
//         </RequiredAuth>
//     )
// },

//     ]

//     return { route }
// }
// export default useStoreRoute
