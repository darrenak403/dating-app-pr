"use server"; // Chỉ thị cho Next.js biết đây là server action (chạy trên server).

import {UserProfile} from "@/app/profile/page"; // Import kiểu dữ liệu UserProfile.
import {createClient} from "../supabase/server"; // Import hàm tạo Supabase client cho server.

export async function getPotentialMatches(): Promise<UserProfile[]> {
  // Tạo Supabase client (server-side).
  const supabase = await createClient();

  // Lấy thông tin user hiện tại từ Supabase Auth.
  const {
    data: {user},
  } = await supabase.auth.getUser();

  // Nếu chưa đăng nhập, báo lỗi.
  if (!user) {
    throw new Error("User not authenticated");
  }

  // Lấy danh sách user khác (trừ chính mình), tối đa 50 người.
  const {data: potentialMatches, error} = await supabase
    .from("users")
    .select("*")
    .neq("id", user.id)
    .limit(50);

  // Nếu truy vấn lỗi, báo lỗi.
  if (error) {
    throw new Error("Error fetching potential matches");
  }

  // Lấy preferences (sở thích) của user hiện tại.
  const {data: userPreferences, error: preferencesError} = await supabase
    .from("users")
    .select("preferences")
    .eq("id", user.id)
    .single();

  // Nếu truy vấn lỗi, báo lỗi.
  if (preferencesError) {
    throw new Error("Error fetching user preferences");
  }

  // Lấy thông tin preferences (ví dụ: giới tính muốn tìm).
  const currentUserReferences = userPreferences.preferences as any;
  const genderPreference = currentUserReferences.gender_preference || [];

  // Lọc danh sách potentialMatches theo preferences (giới tính mong muốn).
  const filteredMatches =
    potentialMatches
      .filter((match, key) => {
        // Nếu không có preference, trả về tất cả.
        if (!genderPreference || genderPreference.length === 0) {
          return true;
        }
        // Chỉ trả về những user có giới tính phù hợp preference.
        return genderPreference.includes(match.gender);
      })
      // Chuẩn hóa dữ liệu trả về theo UserProfile.
      .map((match) => ({
        id: match.id,
        full_name: match.full_name,
        username: match.username,
        email: "", // Không trả về email vì lý do bảo mật.
        gender: match.gender,
        birthdate: match.birthdate,
        bio: match.bio,
        avatar_url: match.avatar_url,
        preferences: match.preferences,
        location_lat: undefined, // Không lấy vị trí ở đây.
        location_lng: undefined,
        last_active: new Date().toISOString(), // Gán tạm thời.
        is_verified: true, // Gán mặc định.
        is_online: false, // Gán mặc định.
        created_at: new Date().toISOString(), // Gán tạm thời.
        updated_at: new Date().toISOString(), // Gán tạm thời.
      })) || [];

  // Trả về danh sách matches đã lọc.
  return filteredMatches;
}
