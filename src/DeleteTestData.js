import { collection, getDocs, deleteDoc } from 'firebase/firestore';
import { db } from './firebase';

function DeleteTestData() {
  const handleDeleteAll = async () => {
    if (window.confirm('Are you sure you want to delete all user records?')) {
      try {
        const querySnapshot = await getDocs(collection(db, 'users'));
        const deletePromises = querySnapshot.docs.map(doc => deleteDoc(doc.ref));
        await Promise.all(deletePromises);
        alert('All records deleted successfully!');
      } catch (error) {
        alert('Error deleting records: ' + error.message);
      }
    }
  };

  return (
    <div className="position-fixed bottom-0 end-0 p-3">
      {/*<button onClick={handleDeleteAll} className="btn btn-danger btn-sm">
        Delete All Test Data
      </button>*/}
    </div>
  );
}

export default DeleteTestData;