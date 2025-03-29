import os
import requests
from PIL import Image

def download_images(base_url, page_prefix, start_page, end_page, output_dir):
    """
    Downloads images from the specified URL range and saves them locally.

    Args:
        base_url (str): Base URL of the images (without page-specific parts).
        page_prefix (str): Prefix of the page identifier in the URL.
        start_page (int): Starting page number.
        end_page (int): Ending page number.
        output_dir (str): Directory to save downloaded images.

    Returns:
        list: List of paths to the downloaded image files.
    """
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)

    image_paths = []

    for page in range(start_page, end_page + 1):
        page_str = f"{page:04d}"
        image_url = f"{base_url}{page_prefix}{page_str}.jpg"
        output_path = os.path.join(output_dir, f"page_{page_str}.jpg")

        try:
            response = requests.get(image_url, stream=True)
            response.raise_for_status()

            with open(output_path, 'wb') as file:
                for chunk in response.iter_content(1024):
                    file.write(chunk)

            print(f"Downloaded: {image_url}")
            image_paths.append(output_path)
        except requests.RequestException as e:
            print(f"Failed to download {image_url}: {e}")

    return image_paths

def create_pdf(image_paths, output_pdf):
    """
    Creates a PDF file from a list of image paths.

    Args:
        image_paths (list): List of paths to image files.
        output_pdf (str): Path to save the generated PDF.
    """
    images = [Image.open(path).convert('RGB') for path in image_paths]

    if images:
        images[0].save(output_pdf, save_all=True, append_images=images[1:])
        print(f"PDF saved to {output_pdf}")
    else:
        print("No images to save in PDF.")

if __name__ == "__main__":
    # Configuration
    base_url = "https://www.book-sk.co.kr/upload/ebook/25acaf/assets/page-images/page-"
    page_prefix = "f5c8458f-913bfc1f-"
    start_page = 1  # Specify the starting page number
    end_page = 10   # Specify the ending page number
    output_dir = "downloaded_images"
    output_pdf = "output.pdf"

    # Download images
    image_paths = download_images(base_url, page_prefix, start_page, end_page, output_dir)

    # Create PDF
    create_pdf(image_paths, output_pdf)
