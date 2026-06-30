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

export const updateContactStatus = async (req, res, next) => {
  const { id } = req.params;
  const { isClosed } = req.body || {};

  try {
    const foundContact = await Contact.findById(id);

    if (!foundContact) {
      return res
        .status(404)
        .json({ success: false, message: `Inquiry IS ${id} not found!` });
    }

    if (isClosed !== undefined) {
      foundContact.isClosed = isClosed;
    }

    const saveContact = await foundContact.save();
    return res.status(200).json({ success: true, data: saveContact });
  } catch (error) {
    next(error);
  }
};

export const deleteContact = async (req, res, next) => {
  const { id } = req.params;

  try {
    const foundContact = await Contact.findById(id);

    if (!foundContact) {
      return res
        .status(404)
        .json({ success: false, message: `Inquiry ID ${id} not found!` });
    }

    const senderName = foundContact.name;

    await Contact.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: `Inquiry ID ${id} from ${senderName} successfully daleted.`,
    });
  } catch (error) {
    next(error);
  }
};
