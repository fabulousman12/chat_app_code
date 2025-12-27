import React, { useEffect, useState,useRef } from 'react';
import UserRow from './UserRow'; // path to the file where you created the memoized component
import './UserRow.css'
import StarLoader from '../pages/StarLoader' 
const UserMain = ({ usersMain, onUserClick, currentUserId, selectedUsers, setSelectedUsers, selectionMode, setSelectionMode, setmutedList, mutedUsers, mode, setMode }) => {
  const [activeSwipeId, setActiveSwipeId] = useState(null);
  const [action, setAction] = useState('');
  const [searchTerm, setSearchTerm] = useState(''); // For search functionality
  const [swipeFeedback, setSwipeFeedback] = useState(''); // To store the swipe feedback text
  const lastScrollTopRef = useRef(0);
  const [showSearchBar, setShowSearchBar] = useState(true);
  const scrollTimeoutRef = useRef(null);
  const [isLoad, setIsLoad] = useState(false);
  
useEffect(() => {
  const container = document.getElementById('user-list-container');
  if (!container) return;

  let lastScrollTop = 0;
  let scrollTimeout;

  const handleScroll = () => {
    const scrollTop = container.scrollTop;

    if (scrollTop > lastScrollTop + 10) setShowSearchBar(false);
    else if (scrollTop < lastScrollTop - 10) setShowSearchBar(true);

    lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;

    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => setShowSearchBar(true), 400);
  };

  container.addEventListener('scroll', handleScroll);
  return () => container.removeEventListener('scroll', handleScroll);
}, []);

  
  useEffect(() => {
    setmutedList(JSON.parse(localStorage.getItem('mutedUsers')));
  }, []);




// Create fake users if usersMain is empty or for testing
const dummyUsers = [
  {
    id: "6859863a05f4cb0dba11a381",
    name: "Dummy 0",
    phoneNumber: "+919474959111",
    Location: "Kolkata, India",
    avatar: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAA", // (trimmed)
    gender: "Male",
    lastMessage: "No messages yet",
    unreadCount: 0,
    publicKey:
      "-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAlFrkbTrgqOX6IeYke6c/\nxWxZ7ZzviO3GkWj3AstFxYD3rEE478IhS8sspZbJetFr7v87TWyFsbZMyACnKUxR\nV8sOHyHF+QZXk9dQ6Km1WGsevmCGEob/qVXjSNvbEgzsFv+SnpnnugrhkCdC16rJ\nYT2Ew5Q5M59mb0acrsSFatSuUn/J4EVCExXPqhBJhsc5ReqLIjFXnrrl1ClbKryO\nzRzs4oDwZzy66tBIwf+MCrE3RJRX2h/JMp7+Lemy3z5aHiAPWnadwWsbAGnLn7G6\nOY1wc+PwqzyZj1f416NXPTBxqhumFVhtZCGTc8dRcRh5c+X3DbslHOX8zUUF0ZXj\nlwIDAQAB\n-----END PUBLIC KEY-----",
    timestamp: "2025-10-08T18:01:36.158Z",
    updatedAt: "2025-10-09T05:19:41.715Z",
    isArchive: false,
  },
  {
    id: "6859863a05f4cb0dba11a382",
    name: "Dummy 1",
    phoneNumber: "+919830102233",
    Location: "Bangalore, India",
    avatar: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAA",
    gender: "Female",
    lastMessage: "Let’s meet tomorrow!",
    unreadCount: 3,
    timestamp: "2025-10-25T14:20:12.000Z",
    updatedAt: "2025-10-25T14:22:10.000Z",
    isArchive: false,
  },
  {
    id: "6859863a05f4cb0dba11a383",
    name: "Dummy 2",
    phoneNumber: "+919812345678",
    Location: "Delhi, India",
    avatar: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAA",
    gender: "Male",
    lastMessage: "Hey! What’s up?",
    unreadCount: 1,
    timestamp: "2025-10-27T16:05:44.000Z",
    updatedAt: "2025-10-27T17:00:00.000Z",
    isArchive: false,
  },
  {
    id: "684eedbdf5a9689a278c78e0",
    name: "Jit",
    phoneNumber: "9339668261",
    Location: "Mumbai, India",
    avatar: null,
    gender: "Female",
    lastMessage: "See you soon 😊",
    unreadCount: 0,
    timestamp: "2025-10-28T08:10:12.000Z",
    updatedAt: "2025-10-28T09:00:00.000Z",
    isArchive: false,
  },
];


const filteredAndSortedUsers = [...usersMain ]
// const filteredAndSortedUsers = [...usersMain]
    .filter(user =>
      (user.name || '').toLowerCase().includes(searchTerm.toLowerCase()) && // Filter by search term
      !user.isArchive &&
      user.id !== currentUserId // Only include users who are not archived
    )
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)); // Sort by most recent timestamp

  const handleSwipe = (direction, user) => {
    setActiveSwipeId(user.id);
    setAction(direction); // Set action to direction (left or right)

    // Update swipe feedback based on the direction of the swipe
    if (direction === 'Left') {
      setSwipeFeedback('Archive Chat'); // Feedback for swipe from right to left
    } else if (direction === 'Right') {
      setSwipeFeedback('Open Chat'); // Feedback for swipe from left to right
    }

    setTimeout(() => {
      setActiveSwipeId(null);
      setAction('');
      setSwipeFeedback('');

      if (mode === 'swipe') {
        if (direction === 'Left') {
          // Archive chat on swipe from right to left
      
          // Call the function to archive the chat (e.g., onArchiveChat)
        } else if (direction === 'Right') {
          // Open chat window on swipe from left to right
         
          onUserClick(user);  // This can be your custom function to open the chat window
        }
      }
    }, 200); // Reset swipe state after 2 seconds
  };

  const handleClick = (user) => {
    if (mode === 'normal') {
      // In normal mode, open chat window on click
      onUserClick(user);
    }
  };

  const handleCallAction = (direction, user) => {
    if (mode === 'normal') {
      // In normal mode, swiping left or right triggers call actions (calls and video calls)
      if (direction === 'Left') {
        setSwipeFeedback('Video Call');
        // Initiate video call or other actions

      } else if (direction === 'Right') {
        setSwipeFeedback('Voice Call');
        // Initiate voice call or other actions
      
      }
    }
    setTimeout(() => {
      setActiveSwipeId(null);
      setAction('');
      setSwipeFeedback('');
    }, 200); // Reset swipe state after a short delay
  };

  // Add dummy users to the list
  // for (let i = 1; i <= 15; i++) {
  //   filteredAndSortedUsers.push({
  //     id: `dummy-${i}`,
  //     name: `Dummy User ${i}`,
  //     timestamp: new Date().toISOString(),
  //     isArchive: false
  //   });
  // }

  // Optional: Re-sort the list after adding dummy users
  filteredAndSortedUsers.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  return (
    <>
    <div className="user-main-container">
       
      {/* Search Bar */}
      {showSearchBar && (
<div
  className={`modern-search-bar flex items-center gap-2 transition-all duration-300 ${
    showSearchBar ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-3 pointer-events-none'
  }`}
>
  <input
    type="text"
    className="modern-search-input flex-1 px-4 py-2 rounded-full  backdrop-blur-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-800 placeholder-gray-500 shadow-sm"
    placeholder="Search users..."
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
  />

  <button
    onClick={() => handleSearch(searchTerm)}
    className="search-btn  hover:bg-blue-600 text-white px-4 py-2 rounded-full transition-all shadow-sm flex items-center justify-center"
    style={{backgroundColor:'rgb(43, 45, 49)'}}
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke="currentColor"
      className="w-5 h-5"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1110.5 3a7.5 7.5 0 016.15 13.65z"
      />
    </svg>
  </button>
</div>


)}


      {/* User List - Scrolling */}
      <div className="user-list-container"  id="user-list-container">
        <div className="list-group">
          {/* Render filtered and sorted users */}
          {filteredAndSortedUsers &&  filteredAndSortedUsers.map(user => (
            <UserRow
              key={user.id}
              user={user}
              isActiveSwipe={user.id === activeSwipeId}
              action={action}
              onSwipe={(direction) => {
                handleSwipe(direction, user); // Handle swipe direction (left or right)
                handleCallAction(direction, user); // Handle call actions based on swipe direction
              }}
              onClick={() => handleClick(user)} // Open chat window on click in normal mode
              mutedUsers={mutedUsers}
              setmutedList={setmutedList}
              selectedUsers={selectedUsers}
              setSelectedUsers={setSelectedUsers}
              selectionMode={selectionMode}
              setSelectionMode={setSelectionMode}
              swipeFeedback={swipeFeedback} // Passing feedback for the swipe
            />
          ))}
          {filteredAndSortedUsers && filteredAndSortedUsers.length === 0 && (
            <div style={{ textAlign: 'center', padding: '1rem', color: '#888' }}>
    No users found.
  </div>
          )}
        </div>
      </div>
    </div>
    </>
  );
};

export default UserMain;
