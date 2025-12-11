import React, { useState, useRef, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Users, UserPlus, Check, X, User } from "lucide-react";

const Members = ({ project, allUsers, onInvite, onRemove, canEdit = false }) => {
    const { getCurrentUser } = useAuth();
    const [openInvite, setOpenInvite] = useState(false);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const dropdownRef = useRef(null);
    const buttonRef = useRef(null);

    // Toggle user selection
    const toggleUser = (user) => {
        setSelectedUsers((prev) => (prev.some((u) => u.id === user.id) ? prev.filter((u) => u.id !== user.id) : [...prev, user]));
    };

    const handleInvite = () => {
        if (selectedUsers.length > 0) {
            onInvite?.(selectedUsers);
            setSelectedUsers([]);
            setSearchTerm("");
            setOpenInvite(false);
        }
    };

    // Filter available users
    const filteredUsers = useMemo(() => {
        return allUsers?.filter(
            (user) =>
                getCurrentUser?.data?.user?.id !== user.id &&
                !project?.projectMembers?.some((m) => m.id === user.id) &&
                (user.name.toLowerCase().includes(searchTerm.toLowerCase()) || user.roles.some((role) => role.toLowerCase().includes(searchTerm.toLowerCase())))
        );
    }, [allUsers, project?.projectMembers, searchTerm]);

    // Dropdown positioning
    const [dropdownStyle, setDropdownStyle] = useState({});
    useEffect(() => {
        if (openInvite && buttonRef.current) {
            const buttonRect = buttonRef.current.getBoundingClientRect();
            const spaceRight = window.innerWidth - buttonRect.right;
            const dropdownWidth = 280;

            setDropdownStyle({
                left: spaceRight < dropdownWidth ? "auto" : 0,
                right: spaceRight < dropdownWidth ? 0 : "auto",
                minWidth: buttonRect.width,
            });
        }
    }, [openInvite]);

    // Click outside to close
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (openInvite && dropdownRef.current && !dropdownRef.current.contains(event.target) && buttonRef.current && !buttonRef.current.contains(event.target)) {
                setOpenInvite(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [openInvite]);

    return (
        <div className="flex flex-col gap-3">
            <div className="flex flex-wrap items-center gap-2">
                {project?.projectMembers?.length > 0 ? (
                    project?.projectMembers?.map((member) => <MemberBadge key={member.id} member={member} onRemove={onRemove} canEdit={canEdit} />)
                ) : (
                    <div className="w-full p-8 border border-dashed border-gray-300 dark:border-[#3e3e42] rounded-xl bg-gradient-to-br from-gray-50 to-white dark:from-[#1e1e1e] dark:to-[#252526] text-center">
                        <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-100 to-amber-100 dark:from-[#37373d] dark:to-[#2a2d2e] flex items-center justify-center shadow-lg border border-orange-200 dark:border-[#3e3e42]">
                            <Users className="w-8 h-8 text-orange-600 dark:text-[#ff9f43]" />
                        </div>
                        <h3 className="mt-4 text-sm font-semibold text-gray-900 dark:text-[#cccccc]">No users added yet</h3>
                        <p className="mt-1.5 text-xs text-gray-500 dark:text-[#858585] max-w-sm mx-auto">Start building your team by inviting users to collaborate and manage access efficiently.</p>
                        {canEdit && (
                            <div className="mt-5">
                                <Button
                                    ref={buttonRef}
                                    onClick={() => setOpenInvite((prev) => !prev)}
                                    className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-lg shadow-orange-200 dark:shadow-orange-900/20"
                                >
                                    <UserPlus className="w-4 h-4 mr-1.5" /> Add User
                                </Button>
                            </div>
                        )}
                    </div>
                )}

                <div className="relative">
                    {canEdit && project?.projectMembers?.length > 0 && (
                        <Button
                            ref={buttonRef}
                            variant="outline"
                            size="sm"
                            className="h-9 px-4 text-sm rounded-lg flex items-center gap-2 border-dashed border-2 border-gray-300 dark:border-[#3e3e42] hover:border-orange-400 dark:hover:border-[#ff9f43] hover:bg-orange-50 dark:hover:bg-[#2a2d2e] transition-colors"
                            onClick={() => setOpenInvite((prev) => !prev)}
                        >
                            <UserPlus className="w-4 h-4 text-orange-500 dark:text-[#ff9f43]" />
                            Add Member
                        </Button>
                    )}

                    {openInvite && (
                        <div
                            ref={dropdownRef}
                            style={dropdownStyle}
                            className="absolute top-full mt-2 w-80 bg-white dark:bg-[#252526] border border-gray-200 dark:border-[#3e3e42] rounded-xl shadow-xl z-50 p-3"
                        >
                            <div className="space-y-3">
                                <input
                                    type="text"
                                    placeholder="Search users by name or role..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full p-2.5 rounded-lg border border-gray-300 dark:border-[#3e3e42] dark:bg-[#1e1e1e] dark:text-[#cccccc] text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 dark:focus:ring-[#ff9f43] focus:border-transparent"
                                />

                                <div className="max-h-64 overflow-y-auto space-y-1">
                                    {filteredUsers?.length > 0 ? (
                                        filteredUsers.map((user) => <DropdownUserItem key={user.id} user={user} isSelected={selectedUsers.some((u) => u.id === user.id)} onToggle={toggleUser} />)
                                    ) : (
                                        <div className="p-4 text-center">
                                            <p className="text-xs text-gray-400 dark:text-[#858585]">No users found</p>
                                        </div>
                                    )}
                                </div>

                                <Button
                                    variant="default"
                                    size="sm"
                                    className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-lg"
                                    onClick={handleInvite}
                                    disabled={selectedUsers.length === 0}
                                >
                                    <UserPlus className="w-4 h-4 mr-2" />
                                    Add {selectedUsers.length > 0 ? `${selectedUsers.length} ` : ""}Selected
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

/* Sub Components */

const MemberBadge = ({ member, onRemove, canEdit }) => (
    <div className="group flex items-center gap-2 bg-gradient-to-r from-gray-50 to-white dark:from-[#252526] dark:to-[#1e1e1e] pr-3 pl-1 py-1.5 rounded-lg shadow-sm border border-gray-200 dark:border-[#3e3e42] hover:border-orange-300 dark:hover:border-[#464647] hover:shadow-md dark:hover:shadow-lg dark:hover:shadow-black/20 transition-all">
        <Avatar className="w-8 h-8 bg-gradient-to-br from-orange-100 to-amber-100 dark:from-[#37373d] dark:to-[#2a2d2e] border-2 border-orange-200 dark:border-[#3e3e42] shadow-sm">
            <AvatarImage src={`/.jpg?height=24&width=24&query=${member?.name}`} />
            <AvatarFallback className="text-xs font-semibold text-orange-700 dark:text-[#ff9f43]">{getInitials(member.name)}</AvatarFallback>
        </Avatar>
        <span className="text-sm font-medium text-gray-700 dark:text-[#cccccc] truncate max-w-[120px]" title={member?.email || member?.name}>
            {member?.name}
        </span>
        {canEdit && (
            <button
                onClick={() => onRemove?.(member)}
                className="ml-auto opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 dark:hover:text-[#f48771] transition-opacity p-1 rounded hover:bg-red-50 dark:hover:bg-[#2a2d2e]"
                aria-label={`Remove ${member.name}`}
            >
                <X className="w-4 h-4" />
            </button>
        )}
    </div>
);

const DropdownUserItem = ({ user, isSelected, onToggle }) => (
    <div
        className={`flex items-center justify-between p-2.5 rounded-lg cursor-pointer transition-all ${
            isSelected ? "bg-orange-50 dark:bg-[#2a2d2e] border border-orange-200 dark:border-[#3e3e42]" : "hover:bg-gray-100 dark:hover:bg-[#2a2d2e] border border-transparent"
        }`}
        onClick={() => onToggle(user)}
    >
        <div className="flex items-center gap-3 flex-1 min-w-0">
            <Avatar className="w-9 h-9 bg-gradient-to-br from-orange-100 to-amber-100 dark:from-[#37373d] dark:to-[#2a2d2e] border-2 border-orange-200 dark:border-[#3e3e42] shadow-sm shrink-0">
                <AvatarFallback className="text-xs font-semibold text-orange-700 dark:text-[#ff9f43]">{getInitials(user.name)}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col min-w-0 flex-1">
                <span className="text-sm font-medium text-gray-700 dark:text-[#cccccc] truncate">{user.name}</span>
                <span className="text-xs text-gray-400 dark:text-[#858585] truncate">{user.roles.join(", ") || "No role"}</span>
            </div>
        </div>
        {isSelected && (
            <div className="ml-2 shrink-0 w-5 h-5 rounded-full bg-orange-500 dark:bg-[#ff9f43] flex items-center justify-center">
                <Check className="w-3 h-3 text-white" />
            </div>
        )}
    </div>
);

const getInitials = (name = "") =>
    name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase();

export default Members;
