import { supabase } from "../lib/superbase";

/**
 * Soft delete de un customer
 * @param {number} id - customer id
 */
export const softDeleteCustomer = async (id) => {
  const { error } = await supabase
    .from("Customer")
    .update({
      soft_deleted: new Date().toISOString(), // fecha + hora
    })
    .eq("id", id);

  if (error) {
    throw error;
  }
};

const softDeleteOrder = async (orderId) => {
  const { error } = await supabase
    .from("Order")
    .update({
      soft_deleted: new Date().toISOString(),
    })
    .eq("id", orderId);

  if (error) {
    throw error;
  }
}

