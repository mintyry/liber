// Use axios to fetch
const axios = require('axios');
// book model so we can make a new book to save to database
const { Book } = require('../models');

// export fetch function
module.exports = async function fetchData() {
  // page passed in from runGutFetchLoop()
  function fetchData(page) {
    try {
      const apiUrl = `https://gutendex.com/books/?page=${page}`;
      // fetch all (32) books from page
      axios.get(apiUrl)
        .then(async (response) => {
          for (let i = 0; i < response.data.results.length; i++) {
            const bookData = response.data.results[i];
            const bookId = bookData.id;
            const title = bookData.title;
            // we dont need to make an authors line, because it comes back properly via authors schema in model
            const imageUrl = bookData.formats['image/jpeg'];
            const textUrl = `https://www.gutenberg.org/ebooks/${bookId}.txt.utf-8`;

            const imageResponse = await axios.get(imageUrl, { responseType: 'arraybuffer' });
            const imageData = Buffer.from(imageResponse.data).toString('base64');

            const textResponse = await axios.get(textUrl);
            const text = textResponse.data;


            // console.log(bookData.authors)

            try {
              const newBook = await Book.create({
                title: title,
                bookId: bookId,
                authors: bookData.authors,
                image: {
                  data: imageData,
                  contentType: 'image/jpeg',
                },
                text: text
              });
              // console.log('this is a new book:', newBook);

              // just so we see our code at work when we npm run the app:
              const newBookShortData = {
                title: newBook.title,
                bookId: newBook.bookId,
                authors: newBook.authors,
              };

              // console.log('info about book minus image & text bc they are long:', newBookShortData)

            } catch (error) {
              // console.error(`Error making new book`, error);
            }
          } //closes for loop
        }) // closes .then()
        .catch(error => {
          // console.error(`Error fetching data from page ${page}:`, error);
        });
    } catch (error) {
      // console.error(`Error fetching and saving data from page ${page}:`, error);
    }
  }//ends function

  function runGutFetchLoop() {
    // Fetch data from page 1 to page 50
    for (let page = 1; page <= 25; page++) {
      fetchData(page);
    }
  }
  // Run the fetch cycle initially
  runGutFetchLoop();

  // Set up an interval to run the fetch cycle every 8 hours (in milliseconds)
  const intervalInMilliseconds = 8 * 60 * 60 * 1000;
  setInterval(runGutFetchLoop, intervalInMilliseconds);
}