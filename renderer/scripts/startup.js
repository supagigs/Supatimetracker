import { supabase } from "./supabaseClient";

async function decideInitialScreen() {
  const session = supabase.auth.session();
  const userEmail = session?.user?.email;

  if (!userEmail) {
    console.warn("No logged-in user, showing project list screen.");
    showProjectListScreen();
    return;
  }

  const { data: sessions, error } = await supabase
    .from("time_sessions")
    .select("id, end_time, frappe_timesheet_id")
    .eq("user_email", userEmail)
    .order("id", { ascending: false })
    .limit(1);

  if (error) {
    console.error("❌ Failed to fetch latest session:", error);
    showProjectListScreen();
    return;
  }

  if (!sessions?.length) {
    showProjectListScreen();
    return;
  }
  const latest = sessions[0];
  if (latest.end_time) {
    showProjectListScreen();
    return;
  }
  showTimerScreen(latest.id);
}


function showProjectListScreen() {
  console.log("🔹 Opening Project List screen");
}

function showTimerScreen(sessionId) {
  console.log(`🔹 Opening Timer screen for session ${sessionId}`);
}

(async () => {
  await decideInitialScreen();
})();
