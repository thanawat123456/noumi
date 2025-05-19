
// import { useState, useEffect } from 'react';

// interface TodoDetailProps {
//   id: number;
//   onClose: () => void;
// }

// interface TodoDetails {
//   id: number;
//   title: string;
//   completed: boolean;
//   created_at: string;
// }

// export default function TodoDetail({ id, onClose }: TodoDetailProps) {
//   const [todo, setTodo] = useState<TodoDetails | null>(null);
//   const { executeQuery, executeSqlWithSave } = useDatabase();
//   const [isEditing, setIsEditing] = useState(false);
//   const [editTitle, setEditTitle] = useState('');

//   useEffect(() => {
//     const fetchTodoDetails = async () => {
//       const results = await executeQuery(
//         'SELECT * FROM todos WHERE id = ?',
//         [id]
//       );
      
//       if (results && results.length > 0 && results[0].values.length > 0) {
//         const row = results[0].values[0];
//         setTodo({
//           id: row[0],
//           title: row[1],
//           completed: Boolean(row[2]),
//           created_at: row[3]
//         });
//         setEditTitle(row[1]);
//       }
//     };
    
//     fetchTodoDetails();
//   }, [id, executeQuery]);

//   const handleSave = async () => {
//     if (editTitle.trim() && todo) {
//       await executeSqlWithSave(
//         'UPDATE todos SET title = ? WHERE id = ?',
//         [editTitle, id]
//       );
      
//       setTodo({
//         ...todo,
//         title: editTitle
//       });
      
//       setIsEditing(false);
//     }
//   };

//   if (!todo) {
//     return (
//       <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
//         <div className="bg-white p-6 rounded-lg w-full max-w-md">
//           <p>กำลังโหลด...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
//       <div className="bg-white p-6 rounded-lg w-full max-w-md">
//         <div className="flex justify-between items-center mb-4">
//           <h2 className="text-xl font-bold">รายละเอียด Todo</h2>
//           <button 
//             onClick={onClose}
//             className="text-gray-500"
//           >
//             ปิด
//           </button>
//         </div>
        
//         {isEditing ? (
//           <div className="mb-4">
//             <input
//               type="text"
//               value={editTitle}
//               onChange={(e) => setEditTitle(e.target.value)}
//               className="w-full border border-gray-300 rounded px-3 py-2"
//             />
//             <div className="flex mt-2 justify-end space-x-2">
//               <button
//                 onClick={() => setIsEditing(false)}
//                 className="px-3 py-1 bg-gray-200 rounded"
//               >
//                 ยกเลิก
//               </button>
//               <button
//                 onClick={handleSave}
//                 className="px-3 py-1 bg-blue-500 text-white rounded"
//               >
//                 บันทึก
//               </button>
//             </div>
//           </div>
//         ) : (
//           <div className="mb-4">
//             <p className="font-medium">{todo.title}</p>
//             <div className="flex mt-2 justify-end">
//               <button
//                 onClick={() => setIsEditing(true)}
//                 className="px-3 py-1 bg-gray-200 rounded"
//               >
//                 แก้ไข
//               </button>
//             </div>
//           </div>
//         )}
        
//         <div className="text-sm text-gray-500">
//           <p>สถานะ: {todo.completed ? 'เสร็จสิ้น' : 'ยังไม่เสร็จ'}</p>
//           <p>สร้างเมื่อ: {new Date(todo.created_at).toLocaleString()}</p>
//         </div>
//       </div>
//     </div>
//   );
// }