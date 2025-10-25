import prisma from "../config/prisma.js";

export const getContact = async (req, res) => {
    try {
        const contacts = await prisma.contact.findMany();
        res.status(200).json(contacts);
    } catch (err) {
        console.error(err);
        res.status(400).json({ error: "Failed to fetch contacts." });
    }
};

export const createContact = async (req, res) => {
    try {
        const { name, email, number,location } = req.body;
        console.log(name,email,number,location)

        if (!name || !email || !number || !location) {
            return res.status(400).json({ error: "Name, email, and number are required." });
        }

        const newContact = await prisma.contact.create({
            data: { name, email, number,location },
        });

        res.status(201).json(newContact);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to create contact." });
    }
};

export const updateContact = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, number,location } = req.body;
        console.log(name,email,number,location)
        if (!name || !email || !number || !location) {
            return res.status(400).json({ error: "Name, email, and number are required." });
        }
        const updatedContact = await prisma.contact.update({
            where: { id: parseInt(id) },
            data: { name, email, number,location },
        });

        res.status(200).json(updatedContact);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to update contact." });
    }
};

export const deleteContact = async (req, res) => {
    try {
        const { id } = req.params;

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