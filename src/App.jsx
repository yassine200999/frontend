import { Routes } from 'react-router-dom'
import Layout from './componenst/laypout/Layout'
import { Route } from 'react-router-dom'
import Catalogue from './pages/catalogue/Catalogue'
import Panier from './pages/panier/Panier'
import ProduitDetail from './pages/produitDetail/ProduitDetail'
import Profils from './pages/profil/Profils'
import Connection from './pages/connection/Connection'
function App() {
  // const [count, setCount] = useState(0)
  //   useEffect(() => {
  //   fetch('category/get_all_categories')
  //     .then(response => response.json())
  //     .then(data => console.log(data));
  // }, []);
  return (
    <>
    <Routes>
      <Route element={ <Layout />} >
      <Route path="/" element={<Catalogue />} />
      <Route path="/produits" element={<ProduitDetail />} />
      <Route path="/panier" element={<Panier />} />
      <Route path="/profil" element={<Profils />} />
      <Route path="/connection" element={<Connection />} /></Route>
    </Routes>
    </>
)}
export default App