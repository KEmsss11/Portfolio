# Import the dataclass decorator.
# @dataclass makes it easier to create classes that mainly store data.
from dataclasses import dataclass

# Import PyMuPDF.
# "fitz" is the Python module used to open and read PDF files.
import fitz


# This class represents the information extracted from ONE PDF page.
@dataclass
class PdfPage:
    # Stores the page number.
    # int means the value should be an integer, such as 1, 2, 3, etc.
    page: int

    # Stores the text extracted from this page.
    # str means the value is a string.
    text: str


# This class represents the COMPLETE result after processing a PDF.
@dataclass
class PdfResult:
    # Stores all the extracted text from the entire PDF
    # as one large string.
    text: str

    # Stores the total number of pages in the PDF.
    pages: int

    # Stores the extracted information for every page.
    # Each item in this list is a PdfPage object.
    page_texts: list[PdfPage]


# Function that extracts text from a PDF file.
#
# file_path: str
#   The path/location of the PDF file.
#
# -> PdfResult
#   Means this function returns a PdfResult object.
def extract_pdf_text(file_path: str) -> PdfResult:

    # Open the PDF file using PyMuPDF.
    #
    # fitz.open() loads the PDF so we can access
    # its pages and extract their text.
    document = fitz.open(file_path)

    # Create an empty list.
    #
    # We will store the extracted information
    # for every PDF page inside this list.
    pages = []

    # Loop through every page in the PDF.
    #
    # enumerate() gives us two things:
    #   index -> the number/index of the page, starting from 0
    #   page  -> the actual PDF page object
    for index, page in enumerate(document):

        # Extract text from the current PDF page.
        #
        # page.get_text("text")
        # tells PyMuPDF that we want the text content.
        #
        # "or ''" means:
        # If no text is returned, use an empty string instead.
        text = page.get_text("text") or ""

        # Create a PdfPage object containing:
        #
        # index + 1 -> the human-readable page number
        # text      -> the text extracted from that page
        #
        # Python starts counting from 0, so we add 1:
        # 0 -> Page 1
        # 1 -> Page 2
        # 2 -> Page 3
        #
        # append() adds the PdfPage object to our pages list.
        pages.append(PdfPage(index + 1, text))

    # Close the PDF after we have finished reading it.
    #
    # This releases the file/resource that was being used.
    document.close()

    # Combine the text from all PDF pages into one large string.
    #
    # p.text for p in pages
    # gets the text from each PdfPage object.
    #
    # "\n\n".join(...)
    # puts two newline characters between each page's text.
    #
    # Example:
    #
    # Page 1 text
    #
    # Page 2 text
    #
    # Page 3 text
    full_text = "\n\n".join(p.text for p in pages)

    # Return a PdfResult containing all the information
    # we collected from the PDF.
    return PdfResult(
        # The complete text from the entire PDF.
        text=full_text,

        # Count how many pages were extracted.
        pages=len(pages),

        # Store the list containing each page's information.
        page_texts=pages,
    )