# ![](/icons/icon.svg) Classroom Tweaks
This is a [Chrome extension]() for educators using [Google Classroom™](https://edu.google.com/workspace-for-education/classroom/). It provides several quality-of-life modifications to speed up and improve your workflow. 

If any tweak isn't helpful for your workflow or it is broken, you can disable the tweak in the extension popup. Tweaks may break at any time as Google updates Classroom. I created this extension for my wife, who is a teacher, so I will prioritize adding and maintaining tweaks that are useful for her. Still, if you have any issues or features you would like to request, please do so on this [Google Form](https://docs.google.com/forms/d/e/1FAIpQLSc6i08Seb7Bcn4CMvtmoBXVAR39Oy3QI19gMT4wITD2FazuyQ/viewform?usp=sf_link).

If you would like to make a donation to support ongoing development of Classroom Tweaks, you can via [Ko-fi](). The support is very much appreciated.

## Tweaks
### Contextual Class Links
When switching between classes, this tweak keeps you on the currently selected tab (i.e. **Stream**, **Classwork**, **People**, and **Grades**). That way, you can switch classes, without switching the task you were working on.

### Expandable Topics
In the **Classwork** tab, this tweak hides the contents of each topic by default. Click the empty space of any topic to view the contents within. You can still navigate to each topic's page by clicking the text of the topic. This tweak makes rearranging and organizing your topics much easier, as you can click and drag each topic as well as expand relevant topics to move contents between them.

### Skip to Grading Page Links
In the **Grades** tab, this tweaks adds buttons, labeled **Grade**, for each assignment. These buttons act as direct links to the grading page.

### Grading Page Keyboard Shortcuts
This tweak adds keyboard shortcuts to Google Classrooms's grading page. You can change any of keys that trigger each shortcut to any **alphanumeric character** as well as **-**, **=**, **/**, **Home**, or **End**.

#### Shortcuts
| Default Key | Action | Description |
|-------------|--------|-------------|
| G | Change Grade | Place focus on the Grade input field. |
| C | Leave Comment | Place focus on the Private Comments input field. |
| Home | First Student | Navigate to the first student in the student selection dropdown. |
| End | Last Student | Navigate to the last student in  the student selection dropdown. |
| D | Next Student | Navigate to the next student. |
| A | Previous Student | Navigate to the previous student. |

Note that when focus is within specific contexts, some or all keyboard shortcuts will not trigger. These situations are as follows:
| Focused Element | Disallowed Shortcut Keys | Explanation |
|-----------------|----------------------|--------------|
| Assignment (Google Doc, PDF, ect.) | all | Assignments are embedded documents separate from the page. Keyboard events that occur within those embeds can not be monitored. Scrolling the assignment without moving focus to within it is possible, therefore keyboard shortcuts may still work after simply scrolling. |
| Grade Input | **Home**, **End**, **-**, **Numeric Characters** | The disallowed characters may be needed to input a grade. |
| Private Comments Input | all | Any character assigned as a shortcut could also be needed to write a comment. |
