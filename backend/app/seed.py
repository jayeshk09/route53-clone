from app.database import init_db, SessionLocal
from app.auth.service import create_user, get_user_by_email
from app.hosted_zones.service import create_hosted_zone
from app.models.user import User


def seed():
    init_db()
    db = SessionLocal()

    try:
        existing = get_user_by_email(db, "demo@example.com")
        if not existing:
            user = create_user(db, "demo@example.com", "demo@example.com", "password123")
        else:
            user = existing

        from app.models.hosted_zone import HostedZone

        existing_zones = db.query(HostedZone).count()
        if existing_zones >= 25:
            print(f"{existing_zones} zones already exist, skipping zone seed.")
            return

        domains = [
            ("hq.example.com", "Public", "Headquarters DNS"),
            ("mail.example.com", "Public", "Mail server zone"),
            ("dev.example.com", "Private", "Development environment"),
            ("staging.example.com", "Private", "Staging environment"),
            ("api.example.com", "Public", "API gateway"),
            ("cdn.example.com", "Public", "CDN distribution"),
            ("shop.example.com", "Public", "E-commerce zone"),
            ("blog.example.com", "Public", "Blog platform"),
            ("app.example.com", "Public", "Web application"),
            ("db.example.com", "Private", "Database cluster"),
            ("cache.example.com", "Private", "Caching layer"),
            ("queue.example.com", "Private", "Message queue"),
            ("auth.example.com", "Public", "Authentication service"),
            ("upload.example.com", "Public", "File uploads"),
            ("search.example.com", "Public", "Search engine"),
            ("analytics.example.com", "Public", "Analytics platform"),
            ("notifications.example.com", "Public", "Notification service"),
            ("payments.example.com", "Private", "Payment processing"),
            ("assets.example.com", "Public", "Static assets"),
            ("docs.example.com", "Public", "Documentation"),
            ("status.example.com", "Public", "Status page"),
            ("wiki.example.com", "Public", "Internal wiki"),
            ("support.example.com", "Public", "Support portal"),
            ("marketing.example.com", "Public", "Marketing site"),
            ("community.example.com", "Public", "Community forum"),
        ]

        count = existing_zones
        for domain, ztype, desc in domains:
            if count >= 25:
                break
            try:
                create_hosted_zone(db, user, domain, ztype, desc)
                count += 1
                print(f"  Created: {domain} ({ztype})")
            except ValueError as e:
                print(f"  Skipped {domain}: {e}")

        print(f"Seed complete. {count} hosted zones in database.")
    finally:
        db.close()


if __name__ == "__main__":
    seed()