'use client';

import LayoutNoSidebar from "@/components/LayoutNoSidebar";
import UserProfile from "@/components/UserProfile";

export default function ProfilePage() {
    const mockUser = {
        username: "johndoe",
        email: "john@example.com",
        full_name: "John Doe",
        phone: "123-456-7890",
        city: "New York",
        state: "NY",
        address: "123 Main St",
        zip_code: "10001",
    };

    return (
        <LayoutNoSidebar>
            <UserProfile user={mockUser} />
        </LayoutNoSidebar>
    );
}
