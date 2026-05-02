const MY_ROOMS_KEY = 'wordquest_my_rooms';

export const Storage = {
  saveRoom: (roomData) => {
    const rooms = Storage.getMyRooms();
    // Check if room already exists to avoid duplicates
    if (!rooms.find(r => r.id === roomData.id)) {
      rooms.unshift(roomData); // Add to beginning
      localStorage.setItem(MY_ROOMS_KEY, JSON.stringify(rooms));
    }
  },

  getMyRooms: () => {
    const data = localStorage.getItem(MY_ROOMS_KEY);
    return data ? JSON.parse(data) : [];
  },

  deleteRoom: (id) => {
    const rooms = Storage.getMyRooms().filter(r => r.id !== id);
    localStorage.setItem(MY_ROOMS_KEY, JSON.stringify(rooms));
  }
};
