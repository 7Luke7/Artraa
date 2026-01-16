'use server'
export function generateCourseStructuredData(course) {
  const siteUrl = import.meta.env.VITE_URL
  const courseUrl = `${siteUrl}/course/${course.slug}`;
  const ratingValue = Number(course.average_rating) || 0;
  const reviewCount = course.review_count;

  const courseSchema = {
    "@context": "https://schema.org",
    "@type": "Course",
    "name": course.title,
    "description": course.description.substring(0, 300),
    "image": course.thumbnail_url,
    "url": courseUrl,
    "provider": {
      "@type": "Organization",
      "name": "Artra",
      "url": siteUrl,
      "logo": `${siteUrl}/logo.png`
    },
    "hasCourseInstance": {
      "@type": "CourseInstance",
      "courseMode": "online",
      "courseWorkload": `PT${course.total_duration}M`
    },
    "timeRequired": `PT${course.total_duration}M`,
    "numberOfCredits": course.total_lessons,
    "educationalLevel": course.level,
    "inLanguage": "ka",
    "creator": {
      "@type": "Person",
      "name": course.instructor_name,
      "url": `${siteUrl}/instructor/${course.instructor_slug}`
    },
    ...(reviewCount > 0 && {
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": ratingValue.toFixed(1),
        "ratingCount": reviewCount,
        "bestRating": "5",
        "worstRating": "1"
      }
    }),
    "offers": {
      "@type": "Offer",
      "price": course.price,
      "priceCurrency": "GEL",
      "availability": "https://schema.org/InStock",
      "url": courseUrl
    }
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "კურსები",
        "item": `${siteUrl}/courses`
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": course.cp.parent_category_name,
        "item": `${siteUrl}/courses/?category=${course.cp.parent_category_slug}`
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": course.category_name,
        "item": `${siteUrl}/courses/?category=${course.category_slug}`
      },
      {
        "@type": "ListItem",
        "position": 4,
        "name": course.title,
        "item": courseUrl
      }
    ]
  };

  const schemas = [courseSchema, breadcrumbSchema];
  return schemas.map(schema => JSON.stringify(schema, null, 2)).join('\n');
}

export function generateLandingStructuredData(siteUrl, courses) {
  const landingSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Artra - ონლაინ განათლება საქართველოში",
    "url": siteUrl,
    "description": "პრაქტიკული ონლაინ კურსები ქართველებისთვის. ტექნოლოგიები, ბიზნესი, დიზაინი და სხვა თანამედროვე პროფესიები.",
    "publisher": {
      "@type": "Organization",
      "name": "Artra",
      "logo": `${siteUrl}/logo.png`,
      "url": siteUrl,
      "sameAs": [
        "https://facebook.com/artra.ge",
        "https://instagram.com/artra.ge"
      ]
    },
    "inLanguage": "ka",
    "keywords": "ონლაინ კურსები, განათლება საქართველოში, ქართული ონლაინ კურსები, ტექნოლოგიები, ბიზნესი, დიზაინი"
  };

  const courseListingSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "itemListElement": courses.map((course, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "Course",
        "@id": `${siteUrl}/course/${course.slug}`,
        "name": course.title,
        "description": course.description.substring(0, 200),
        "image": course.thumbnail_url,
        "url": `${siteUrl}/course/${course.slug}`,
        "provider": {
          "@type": "Organization",
          "name": "Artra",
          "url": siteUrl
        },
        "educationalLevel": course.level,
        "timeRequired": `PT${course.total_duration}M`,
        "numberOfCredits": course.total_lessons,
        "inLanguage": "ka",
        "offers": {
          "@type": "Offer",
          "price": course.price,
          "priceCurrency": "GEL",
          "availability": "https://schema.org/InStock"
        },
        "creator": {
          "@type": "Person",
          "name": course.instructor_name
        },
        ...(course.review_count > 0 && {
          "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": Number(course.average_rating).toFixed(1),
            "ratingCount": course.review_count
          }
        })
      }
    }))
  };

  return [landingSchema, courseListingSchema]
    .map(schema => JSON.stringify(schema, null, 2))
    .join('\n');
}