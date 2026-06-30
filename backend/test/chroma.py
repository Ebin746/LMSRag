import os
import sys
from collections import defaultdict

# ---------------------------------------------------------
# Add backend root to Python path
# ---------------------------------------------------------

BASE_DIR = os.path.abspath(
    os.path.join(os.path.dirname(__file__), "..")
)

sys.path.insert(0, BASE_DIR)

# ---------------------------------------------------------

from database.chroma_client import get_collection


collection = get_collection()

print("=" * 80)
print("Collection :", collection.name)
print("Total Chunks :", collection.count())
print("=" * 80)

data = collection.get(
    include=["metadatas"]
)

documents = defaultdict(list)

for meta in data["metadatas"]:
    documents[meta["document_id"]].append(meta)

for document_id, chunks in documents.items():

    first = chunks[0]

    print("\n" + "=" * 80)

    print(f"Document ID : {document_id}")
    print(f"Filename    : {first.get('filename')}")
    print(f"Visibility  : {first.get('visibility')}")
    print(f"Course ID   : {first.get('course_id')}")
    print(f"Module ID   : {first.get('module_id')}")
    print(f"Uploaded By : {first.get('uploaded_by')}")
    print(f"Chunks      : {len(chunks)}")

    print("=" * 80)