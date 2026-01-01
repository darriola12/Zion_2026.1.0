import { supabase } from "../lib/superbase";

// Función para subir imagen
const uploadImage = async (file) => {
  if (!file) return null;

  const fileName = `${Date.now()}_${file.name}`; // nombre único
  const { data, error } = await supabase.storage
    .from("product-images") // tu bucket
    .upload(fileName, file);

  if (error) {
    console.error("Error al subir imagen:", error.message);
    return null;
  }

  // Obtener la URL pública
  const { publicURL, error: urlError } = supabase.storage
    .from("product-images")
    .getPublicUrl(data.path);

  if (urlError) {
    console.error("Error al obtener URL:", urlError.message);
    return null;
  }

  return publicURL;
};
