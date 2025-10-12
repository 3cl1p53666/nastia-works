const yaml = require("js-yaml");
const fs = require("fs");
const path = require("path");
const matter = require("gray-matter");

module.exports = function(eleventyConfig) {

  // This command tells Eleventy to copy the entire "assets" folder...
  eleventyConfig.addPassthroughCopy("src/assets");
  eleventyConfig.addPassthroughCopy("src/_works");
  eleventyConfig.addPassthroughCopy("src/admin");

  // ==> THIS IS THE CORRECTED DATA LOADING FUNCTION <==
  // It reads your simplified YAML file and makes it available as "categories".
  eleventyConfig.addGlobalData("categories", () => {
    const fileContents = fs.readFileSync("./src/_data/categories.yml", "utf8");
    return yaml.load(fileContents);
  });

  // Debugging build crash if needed
  eleventyConfig.on("eleventy.before", ({ dir }) => {
    console.log("Eleventy is starting...");
    console.log("Input directory:", dir.input);
  });

  // Explicitly load works collection
  eleventyConfig.addGlobalData("works", () => {
    const worksDir = "./src/_works";
    const files = fs.readdirSync(worksDir); // Read all files in the _works directory
    const works = files
      .filter(file => file.endsWith(".md")) // Only process Markdown files
      .map(file => {
        const filePath = path.join(worksDir, file);
       const fileContents = fs.readFileSync(filePath, "utf8");
        const { data, content } = matter(fileContents); // Parse front matter and content
       return { data, content, filePath };
      });
    console.log("Loaded works:", works.map(work => work.data.title)); // Debugging
    return works;
  });

  // Add a filter to format strings for JSON
  eleventyConfig.addFilter("jsonify", function (text) {
    return JSON.stringify(text);
  });
  
  // Create a custom collection for "works"
  eleventyConfig.addCollection("works", function(collectionApi) {
    return collectionApi.getFilteredByGlob("src/_works/*.md")
      .sort((a, b) => b.date - a.date); // Sorts newest first
  });

  eleventyConfig.addCollection("animation", function(collectionApi) {
    return collectionApi.getFilteredByGlob("src/_works/*.md")
      .filter(item => item.data.category === "animation")
      .sort((a, b) => b.date - a.date);
  });
  
  eleventyConfig.addCollection("books", function(collectionApi) {
    return collectionApi.getFilteredByGlob("src/_works/*.md")
      .filter(item => item.data.category === "books")
      .sort((a, b) => b.date - a.date);
  });


 // This is the official way to configure Eleventy's source and output folders.
  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes"
    }
  };
};