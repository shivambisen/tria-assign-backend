import prisma from "../config/prisma.js";

export const getContact = async (req, res) => {
    try {
      const page = parseInt(req.query.page ) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;
  
      const contacts = await prisma.contact.findMany({
        skip,
        take: limit,
      });
  
      const total = await prisma.contact.count();
  
      res.json({
        data: contacts,
        total,
        page,
        totalPages: Math.ceil(total / limit),
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error fetching contacts" });
    }
  }

  export const createContact = async (req, res) => {
    try {
      const { name, email, number, location } = req.body;
  
      if (!name || !email || !number || !location) {
        return res.status(400).json({ error: "All fields (name, email, number, location) are required." });
      }
  
      // Check if email or phone number already exists
      const existing = await prisma.contact.findFirst({
        where: {
          OR: [{ email }, { number }],
        },
      });
  
      if (existing) {
        let conflictField = existing.email === email ? "email" : "phone number";
        return res.status(409).json({ error: `A contact with this ${conflictField} already exists.` });
      }
  
      const newContact = await prisma.contact.create({
        data: { name, email, number, location },
      });
  
      return res.status(201).json(newContact);
  
    } catch (err) {
      console.error("Error creating contact:", err);
  
      if (err instanceof prisma.PrismaClientKnownRequestError) {
        if (err.code === "P2002") {
          const field = err.meta?.target?.join(", ") || "unique field";
          return res.status(409).json({ error: `A contact with this ${field} already exists.` });
        }
      }
  
      return res.status(500).json({ error: "Failed to create contact. Please try again later." });
    }
  };
  
  export const updateContact = async (req, res) => {
    try {
      const { id } = req.query;
      console.log(id)
      const { name, email, number, location } = req.body;
  
      if (!name || !email || !number || !location) {
        return res.status(400).json({ error: "All fields (name, email, number, location) are required." });
      }
  
      const existing = await prisma.contact.findFirst({
        where: {
          OR: [{ email }, { number }],
          NOT: { id: parseInt(id) },
        },
      });
  
      if (existing) {
        let conflictField = existing.email === email ? "email" : "phone number";
        return res.status(409).json({ error: `Another contact with this ${conflictField} already exists.` });
      }
  
      const updatedContact = await prisma.contact.update({
        where: { id: parseInt(id) },
        data: { name, email, number, location },
      });
  
      return res.status(200).json(updatedContact);
  
    } catch (err) {
      console.error("Error updating contact:", err);
  
      if (err instanceof prisma.PrismaClientKnownRequestError) {
        if (err.code === "P2025") {
          return res.status(404).json({ error: "Contact not found." });
        } else if (err.code === "P2002") {
          const field = err.meta?.target?.join(", ") || "unique field";
          return res.status(409).json({ error: `A contact with this ${field} already exists.` });
        }
      }
  
      return res.status(500).json({ error: "Failed to update contact. Please try again later." });
    }
  };
  
export const deleteContact = async (req, res) => {
    try {
        const { id } = req.query;
        console.log(id)
        await prisma.contact.delete({
            where: { id: parseInt(id) },
        });

        res.status(200).json({ message: "Contact deleted successfully." });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to delete contact." });
    }
};

export const searchContact = async (req, res) => {
    try {
      const { query } = req.query;
  
      if (!query || typeof query !== "string") {
        return res.status(400).json({ message: "Query parameter is required" });
      }
  
      const contacts = await prisma.contact.findMany({
        where: {
          OR: [
            { name: { contains: query, mode: "insensitive" } },
            { email: { contains: query, mode: "insensitive" } },
          ],
        },
      });
  
      res.status(200).json(contacts);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  };