# Mission Writing Guide

## Core Principles

### 1. Every Mission Must Be Actionable
- ❌ Bad: "Improve your SEO"
- ✅ Good: "Add 3 keywords to your homepage title tag"

### 2. Clear Outcome
- Every mission should answer: "What will I have when I'm done?"
- Example: "You'll have a tested email sequence that brings back inactive users"

### 3. Time-Boxed
- 5-15 minutes maximum
- If it takes longer, break it into multiple missions

### 4. No Theory
- No "Learn about..." or "Research..." missions
- Only concrete actions

## Required Fields

Every mission template must include:

```javascript
{
    title: string,              // Action-oriented, max 60 chars
    description: string,        // One sentence outcome
    whyMatters: string,         // Why this specific action drives results  
    category: enum,             // onboarding|revenue|traffic|conversion|retention
    xpReward: number,           // 100-300 based on impact
    estimatedTime: string,      // "5 minutes", "10 minutes", "15 minutes"
    impactLevel: enum,          // foundation|low|medium|high
    steps: [                    // 3-5 steps max
        {
            description: string,  // Specific action
            xpReward: number      // Proportion of total
        }
    ]
}
```

## Quality Checklist

Before adding a mission, ask:
1. Can a complete beginner do this in <15 minutes?
2. Is the outcome tangible and measurable?
3. Does it drive actual business results?
4. Is the "why" compelling and specific (not generic)?

## Examples

### ✅ Good Mission
```javascript
{
    title: "Fix Your Most Broken Page",
    description: "Find and fix the page that's losing you the most visitors",
    whyMatters: "One slow or broken page can cost you 30% of potential customers. Fix it in 10 minutes.",
    steps: [
        { description: "Open Google Analytics and find your highest bounce-rate page" },
        { description: "Test the page on mobile - does it load in <3 seconds?" },
        { description: "Fix one obvious issue (broken link, missing image, slow script)" }
    ]
}
```

### ❌ Bad Mission
```javascript
{
    title: "Improve Website Performance",  // Too vague
    description: "Make your website faster",  // No specific outcome
    whyMatters: "Fast sites are better",  // Generic, not compelling
    steps: [
        { description: "Learn about CDNs" },  // Theory, not action
        { description: "Research optimization tools" }  // Research, not action
    ]
}
```

## Mission Categories

### Revenue
Focus: Immediate cash generation
- Flash sales
- Upsells
- Price optimization
- Payment friction reduction

### Traffic
Focus: Getting more eyeballs
- Content repurposing
- SEO quick wins
- Social distribution
- Referrals

### Conversion
Focus: Turning visitors into customers
- Signup friction
- Trust signals
- Call-to-action optimization
- Form simplification

### Retention
Focus: Keeping customers engaged
- Win-back campaigns
- Engagement triggers
- Feature adoption
- Churn prevention

## Writing Tips

1. **Use action verbs**: Launch, Fix, Add, Remove, Test
2. **Be specific**: Not "social media" but "LinkedIn" or "Twitter"
3. **Make it urgent**: "48-hour" not "temporary"
4. **Show the math**: "3-5x better" not "better"
5. **One clear action per step**: No "and" in step descriptions
