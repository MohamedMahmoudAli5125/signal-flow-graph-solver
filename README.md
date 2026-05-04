#  3anteel El Signal Flow Graph Solver

A powerful, interactive web-based tool for designing and analyzing Control Systems Signal Flow Graphs (SFG). Built with Angular and Cytoscape.js, this application allows users to visually construct systems and automatically calculates the overall transfer function using **Mason's Gain Formula**.

##  The Idea
Signal Flow Graphs are a visual representation of a system of simultaneous algebraic equations, widely used in control theory and engineering. Analyzing complex graphs by hand is prone to errors, especially when identifying higher-order non-touching loops. 

This project solves that problem by providing a digital canvas where the user defines the total number of nodes and the numeric branch gains between them. The solver's algorithm then traverses the graph, identifying all components necessary to compute the exact system transfer function.

##  Key Features & Requirements Met

1. **Graphical User Interface (GUI):** 
   A sleek, dark-themed, glassmorphism interface that is highly responsive. Features custom modal pop-ups for clean, non-blocking user input.
2. **Interactive Graph Drawing:** 
   Users can visually draw the signal flow graph. The UI clearly displays nodes, directed branches, and numeric gains. It includes smart edge-routing (dynamic arcs) so feedforward and deep-feedback paths curve gracefully over/under the graph without intersecting intermediate nodes.
3. **Path & Loop Detection:** 
   The algorithmic solver traverses the graph to accurately list:
   * All Forward Paths.
   * All Individual Loops.
   * All combinations of *n* Non-Touching Loops (Degree 2, Degree 3, etc.).
4. **Delta (Δ) Calculations:** 
   Automatically calculates and displays:
   * The main system determinant (**Δ**).
   * The individual path determinants (**Δ1, ..., Δm**) where *m* is the total number of forward paths.
5. **Overall System Transfer Function:** 
   Computes the final transfer function from the selected Source (Input) node to the Sink (Output) node using Mason's Gain Formula.

##  Technologies Used
* **Framework:** Angular (TypeScript, HTML, CSS)
* **Graph Visualization:** Cytoscape.js
* **Styling:** Custom CSS with Glassmorphism and CSS Flexbox

##  Getting Started

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) and the [Angular CLI](https://angular.io/cli) installed on your machine.

### Installation
1. Clone this repository to your local machine.
2. Open a terminal and navigate to the root directory of the project (where the `package.json` and `angular.json` files are located).
3. Install the required dependencies:
```bash
npm install
```
Start the development server:

```bash
ng serve
```
Open your browser and navigate to http://localhost:4200.

How to Use
Add Nodes: Click the  Add Node button and click anywhere on the grid canvas to place nodes (n1, n2, n3...).

Add Edges (Branches): Click Add Edge, then click a source node, followed by a target node. A custom modal will appear asking for the numeric gain of the branch.

Select / Edit: Use the Select tool to click on existing edge gains to edit their values.

Solve Graph: Once your system is drawn, click  Solve Graph. Enter your Starting Node ID and Ending Node ID. The right-hand sidebar will slide in with the complete mathematical breakdown and the final Transfer Function!

Export/Import: Save your complex graphs as JSON files using the Export button, and load them later using Import.

# Author
Mohamed Gomaa
Mohamed Mahmoud
Mohamed Wahban
Anas Mahmoud
Moaz Hassan
