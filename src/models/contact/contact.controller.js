import { Contact } from "./contact.model.js";

export const getContacts = async (req, res, next) => {
  try {
    const allContacts = await Contact.find();
    return res.status(200).json({ success: true, data: allContacts });
  } catch (error) {
    next(error);
  }
};

export const createContact = async (req, res, next) => {
  const { name, email, phone, lineId, message } = req.body || {};
  console.log(req.body);

  if (!name || !email || !phone || !message) {
    return res.status(400).json({
      success: false,
      message: "Name, Email, Phone, Message is require!",
    });
  }

  try {
    const newContact = await Contact.create({
      name,
      email,
      phone,
      lineId,
      message,
    });
    return res.status(201).json({ success: true, data: newContact });
  } catch (error) {
    next(error);
  }
};
