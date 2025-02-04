## Project Documentation: Masies i Cases Rurals Catalog

This document provides an overview of the "Masies i Cases Rurals" project, a web application designed to showcase a catalog of rural houses (Masies) with interactive features.

**1. Project Overview**

The "Masies i Cases Rurals" project is a web-based catalog that allows users to explore rural houses. It presents houses both on an interactive map and in a list format, enabling users to easily browse and find properties of interest. The application provides detailed information about each house, including its conservation status, current use, historical notes, and potential renovation options. It's designed to be user-friendly and informative, leveraging modern web technologies for a seamless experience.

**2. Technology Stack**

This project is built using the following technologies:

*   **Next.js**: A React framework for building web applications, providing features like server-side rendering, routing, and API routes.
*   **React**: A JavaScript library for building user interfaces, used for creating reusable UI components.
*   **TypeScript**: A statically typed superset of JavaScript, enhancing code maintainability and developer experience.
*   **Tailwind CSS**: A utility-first CSS framework for rapidly styling the application with pre-defined classes.
*   **Shadcn/ui**: A collection of reusable UI components built with React and Tailwind CSS, providing a consistent and accessible design system.
*   **Leaflet**: A JavaScript library for interactive maps, used to display house locations on a map interface.
*   **Recharts**: A composable charting library built on React, used for visualizing data related to the houses.
*   **Lucide React**: A library of beautiful and consistent icons, enhancing the user interface.
*   **Class Variance Authority (cva)**: A utility for creating type-safe and reusable component variants.
*   **Tailwind Merge**: A utility to efficiently merge Tailwind CSS classes in React.

**3. Functionality**

The application provides the following key functionalities:

*   **Interactive Map Display**: Houses are displayed as markers on a Leaflet map, allowing users to visually explore their locations and click on markers for details.
*   **House Listing**: Houses are also presented in a scrollable list, offering a structured way to browse properties.
*   **Filtering**: Users can filter houses based on:
    *   **Conservation Status**: (e.g., "Molt bo", "Bo", "Regular", "Dolent", "Ruïnes", "En reformes", "Moderna").
    *   **Current Use**: (e.g., "Habitatge", "Cap", "Magatzem", "Cobert", "2 habitatges", "Barraca", "Cobert reformat", "En construcció", "Sense camí d'accés", "Habitatge pendent de primera ocupació", "Ruïnós", "Habitatge pendent de rehabilitació", "Casa de masoveria", "Oficines i restaurant").
*   **Detailed House Information**: Clicking on a house marker or list item opens a dialog with comprehensive details, including:
    *   House Name
    *   Property Icon indicating Conservation Status
    *   Image of the House (linked to PDF page)
    *   Owner Information
    *   Cadastral Reference
    *   Current Use
    *   Accessibility
    *   Detailed Description (Structure, Materials, Historical Notes)
    *   Renovation Options
*   **Data Visualization**: A dashboard (RuralHousesDashboard) displays charts, such as a bar chart visualizing the distribution of houses by conservation status, providing insights into the overall catalog.

**4. File Structure**

The project's file structure is organized as follows:

```
public/
  file.svg          # Generic file icon
  globe.svg         # Globe icon
  next.svg          # Next.js logo icon
  vercel.svg        # Vercel logo icon
  window.svg        # Window icon
src/
  app/
    globals.css     # Global CSS styles using Tailwind
    layout.tsx      # Root layout component for the application
    page.tsx        # Home page component - dynamic wrapper for Main component
  components/
    ui/             # Reusable UI components (buttons, cards, dialogs, etc.) using Shadcn/ui
      badge.tsx
      button.tsx
      card.tsx
      dialog.tsx
      input.tsx
      select.tsx
    HouseList.tsx     # Component for displaying the list of houses
    Main.tsx          # Main page component, integrating map, list, and filters
    RuralHousesDashboard.tsx # Component for displaying charts and insights
  data/
    masies.json       # JSON file containing house data
  lib/
    utils.ts        # Utility functions (e.g., class name merging)
.gitignore          # Specifies intentionally untracked files that Git should ignore
components.json     # Configuration file for Shadcn/ui components
next.config.ts      # Next.js configuration file
package.json        # Project dependencies and scripts
postcss.config.mjs  # PostCSS configuration file
README.md           # Project documentation (this file)
tailwind.config.ts  # Tailwind CSS configuration file
tsconfig.json       # TypeScript configuration file
```

**5. Setup and Usage**

To run this project locally, follow these steps:

1.  **Install Node.js and npm or yarn:** Ensure you have Node.js and npm (Node Package Manager) or yarn installed on your machine.
2.  **Clone the repository:**
    ```bash
    git clone <repository_url>
    cd <repository_directory>
    ```
3.  **Install dependencies:**
    ```bash
    npm install  # or yarn install
    ```
4.  **Set up environment variables:**
    *   Create a `.env.local` file in the project root directory.
    *   Add your Mapbox Access Token to the `.env.local` file:
        ```
        NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=<your_mapbox_access_token>
        ```
        You can obtain a Mapbox Access Token by signing up at [https://www.mapbox.com/](https://www.mapbox.com/).
5.  **Run the development server:**
    ```bash
    npm run dev  # or yarn dev
    ```
6.  **Access the application:** Open your browser and navigate to `http://localhost:3000`.

**6. Key Components**

*   **`src/app/page.tsx`**: This is the main entry point for the application's home page. It dynamically imports the `Main` component to ensure client-side rendering for interactive features.
*   **`src/components/Main.tsx`**: This component is the core of the application. It handles:
    *   Fetching and managing house data from `masies.json`.
    *   Implementing filter logic for conservation status and current use.
    *   Displaying the Leaflet map and handling marker interactions.
    *   Rendering the `HouseList` component.
    *   Managing the dialog for detailed house information.
*   **`src/components/HouseList.tsx`**: This component is responsible for rendering the list of filtered houses in a grid layout using `Card` components from `shadcn/ui`. Each card displays basic house information and an image.
*   **`src/components/RuralHousesDashboard.tsx`**: This component provides a dashboard view with data visualizations. It includes:
    *   A bar chart showing the distribution of houses by conservation status, using `recharts`.
    *   A "Quick Insights" card displaying summary statistics like the total number of houses and the count of well-preserved houses.
*   **`src/components/ui/*`**: These components are reusable UI elements built using `shadcn/ui` and styled with Tailwind CSS. They provide a consistent look and feel throughout the application and include components like `Badge`, `Button`, `Card`, `Dialog`, `Input`, and `Select`.

**7. Data Source**

The application's data source is `src/data/masies.json`. This JSON file contains an array of house objects, each with properties like:

*   `name`: Name of the house.
*   `reference_number`: Unique identifier.
*   `cadastral_reference`: Cadastral reference number.
*   `owner_name`: Name of the owner.
*   `address`: Address of the house.
*   `coordinates`: Latitude and longitude for map placement.
*   `construction_period`: Estimated construction period.
*   `conservation_status`: Current conservation status.
*   `current_use`: Current use of the house.
*   `accessibility`: Accessibility information.
*   `description`: Detailed description (structure, materials, historical notes).
*   `permitted_uses`: Permitted uses for renovation.
*   `renovation_options`: Potential renovation options.
*   `additional_notes`: Additional notes.
*   `pdf_page`: Page number in a PDF document (likely for image referencing).

**8. Potential Improvements**

Possible future enhancements for this project could include:

*   **Search Functionality**: Implement a search bar to allow users to search houses by name, reference number, or other criteria.
*   **Advanced Filtering**: Add more filter options, such as filtering by permitted uses, accessibility, or construction period.
*   **Image Gallery**: Enhance the house details dialog with a gallery of images instead of a single image linked to a PDF page.
*   **Data from External Source/CMS**: Connect the application to a database or CMS to manage house data dynamically instead of using a static JSON file.
*   **User Authentication and Favorites**: Allow users to create accounts, save favorite houses, and potentially add features for property owners to manage their listings.
*   **Language Localization**: Support multiple languages, especially Catalan and Spanish, to cater to a wider audience.
*   **Accessibility Improvements**: Further enhance accessibility to ensure the application is usable by everyone.
*   **Performance Optimization**: Optimize the application for better performance, especially with a large dataset of houses.

This documentation should help developers understand the project's structure, functionality, and technology stack, facilitating maintenance and future development.