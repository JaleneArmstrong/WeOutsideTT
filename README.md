# WeOutside TT

**Date:** February 2, 2026  
**Group:** Code & Calypso  
**Platform:** Android (Optimized & Tested)  

---

## 1. Executive Summary

WeOutside TT is a geography-first event discovery application designed to solve the problem of fragmented information in Trinidad and Tobago’s event landscape. While current social media platforms offer text-based lists, WeOutside TT provides an interactive map that visualizes "limes," cultural festivals, and nature spots across the entire country.

---

## 2. The Problem

In Trinidad and Tobago, finding things to do often requires being part of specific social media circles or WhatsApp groups. There is no centralized platform that allows a user to see what is happening nearby in real-time. This leads to low visibility for niche cultural events and local businesses outside of the main urban hubs.

---

## 3. The Solution

The app centers the user on a high-performance map of the islands. By categorizing events into culturally relevant tags, users can filter their surroundings to find exactly what they are looking for.

**Key Features:**

- **Geographic Visualization:** Pins are scattered nationwide, covering areas from the Icacos peninsula to the Toco lighthouse.  
- **Local Taxonomy:** Event tagging is tailored to Trinidadian culture rather than generic international categories.  
- **Cloud Synchronization:** Powered by a live Supabase backend for instant data retrieval.  

---

## 4. Technical Stack

- **Frontend:** React Native (Expo) - Built and tested on Android.  
- **Backend & Database:** Supabase (PostgreSQL) using JSONB for dynamic event tagging.  
- **ORM:** Prisma (Schema definition and data management).  
- **Maps:** Integrated Google Maps API via react-native-maps.  

---

## 5. How to Run and Interact with the Solution

### A. Using Expo Go (Recommended for Judges)

Download the Expo Go app from the Google Play Store on an Android device. Open the app and scan this QR code:

![QR Code](app-qr.svg)

**Note:** Ensure location permissions are granted to see your position on the map relative to the events.

### B. Interacting with the Map

- **Zooming/Panning:** Move across the islands to see pins in various villages and towns.  
- **Event Details:** Tap any pin to see the event title, a brief description of the "vibe," the specific tags, and an associated image.  
- **Filtering:** Use the category selector to narrow down events by your interest.  

---

*Made with ❤️ for TRINBAGO TECH HACKATHON & IDEATHON 2026 and by Code & Calypso*
