import sys
import os
import getpass

def main():
    print("\n=== IPL Data Platform Production Seeder ===")
    print("This script will populate your remote database with the necessary data.")
    print("You need your Supabase Connection String (Transaction mode recommended).")
    print("Format example: postgresql://postgres:[PASSWORD]@db.project.supabase.co:5432/postgres")
    
    url = getpass.getpass("\nEnter Connection String: ").strip()

    if not url:
        print("Error: No connection string provided.")
        return

    # Fix potential 'postgres://' compatibility issue if user copies from old dashboard
    if url.startswith("postgres://"):
        url = url.replace("postgres://", "postgresql://", 1)

    # Set the environment variable for the seed script to pick up
    os.environ["DATABASE_URL"] = url

    # Add the backend/app directory to sys.path so imports work
    current_dir = os.getcwd()
    app_dir = os.path.join(current_dir, "backend", "app")
    sys.path.append(app_dir)

    print(f"\nStarting seed process...")
    print(f"Targeting Database: {url.split('@')[-1].split('/')[0]}...") # Print host for verification

    try:
        # Import seed module dynamically after setting path and env
        import seed
        seed.seed_data()
        print("\n\u2705 Seeding process finished. Please check your frontend!")
    except ImportError as e:
        print(f"\n\u274c Error importing seed script: {e}")
        print(f"Ensure you are running this from the project root. Current: {current_dir}")
    except Exception as e:
        print(f"\n\u274c Error during seeding: {e}")

if __name__ == "__main__":
    main()
