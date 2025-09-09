import { Outlet } from "react-router-dom";
import SmallScreenSidebar from "./views/dashboard/components/Sidebar/SmallScreenSidebar";
import DesktopSidebar from "./views/dashboard/components/Sidebar/DesktopSidebar";
import TopBar from "./views/dashboard/components/Topbar/TopBar";
import { useEffect, useLayoutEffect, useState } from "react";
import ProfileModal from "./views/auth/profilemodal";
import { supabase } from "./supabaseClient";
import { useDispatch } from "react-redux";
import { setUser, updateUserField } from "./redux/userSlice";
import { getStorage } from "./utilities/cssfunction";

function Layout() {
    const [openModal, setopenModal] = useState(false);
    const dispatch = useDispatch();
    const [client, setclient] = useState(getStorage('client','number'));

   
  const fetchUserData = async () => {
    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

       // ✅ Fetch profile data
       const { data : profileData, error } = await supabase
       .from("profile") // or "profile" depending on which table
       .select("*")
       .eq("user_id", user.id)
       .limit(1)
       .order("created_at", { ascending: false })
       .single();
       
       if (error) {
        console.error(error);
        return;
      }

      const clientType = user?.user_metadata;

      if (user){

            if (profileData) {
              dispatch(setUser(profileData));
            } else {
              dispatch(
                updateUserField({
                  field: "nomSociete",
                  value: clientType?.companynumber,
                })
              );
            }

      } 
    } catch (error) {}
  };


  useLayoutEffect(() => {
    fetchUserData();
  }, []);


    
  return (
    <div>
      <SmallScreenSidebar client={client} />
      <DesktopSidebar client={client} />
      <TopBar setopenModal={setopenModal} />

      <main className="py-10 lg:pl-72">
        <Outlet />
      </main>
      <ProfileModal onClose={setopenModal} open={openModal} />

    </div>
  );
}

export default Layout;
