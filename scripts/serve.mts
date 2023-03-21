import inquirer from "inquirer";
import { exec, execSync } from "node:child_process";
import ora from "ora";

const getProjects = async (): Promise<unknown> => {
  const output = await execSync(
    `npx nx print-affected --all --target=serve --type=app`
  );
  const json = JSON.parse(output.toString());
  return json.projects;
};

const spinner = ora({ color: "green" });

const logo = `  
            ...   :..              
        .~?Y5P!  .PP5Y7^.          
      ~YPPPPPP!  .5PPPPP5?:        
    :YPPPPPPPP!  .5PPPPPPPP?.      
   ~PPPPPPPPPP!  .5PPPPPPPPPY.     
  :PPPPPPPPPPP!  .5PPPPPPPPPPJ     
  ?PPPPPPPPPPP!  .5PPPPPPPPPPP:    
  JPPPPPPPPPPP!  .5PPPPPPPPPPP^    
  !PPPPPPPPPPP!  .5PPPPPPPPPPP:    
  .YPPPPPPPPPP!  .5PPPPPPPPPPP:    
   .YPPPPPPPPP!  .5PPPPPPPPPPP:    
     !5PPPPPPP!  .5PPPPPPPPPPP:    
      .~YPPPPP!  .PPPPPPPPPPPP:    
         .^!?Y~  .YYYYYYYYYYY5:    
 `;

interface Task {
  command: string;
  label: string;
}

async function runFunction(task: Task): Promise<string> {
  spinner.start(`${task.label}`);
  return new Promise((resolve, reject) => {
    const proc = exec(task.command, (error, stdout, stderr) => {
      if (error) {
        reject(error);
      }
    });

    proc.stdout?.pipe(process.stdout);
  });
}

const main = async () => {
  console.log(logo);
  console.log("");

  const projects = await getProjects();

  const selection = await inquirer.prompt([
    {
      type: "checkbox",
      name: "projects",
      filter(answer) {
        return answer.map((trigger: string) => trigger.split(" ")[0]);
      },
      message: "Select the services you want to start",
      choices: projects,
    },
  ]);
  const selectedProjects: string[] = selection.projects;
  console.debug("Starting services: ", selectedProjects);

  const startServices: Task = {
    command: `npx nx run-many --parallel -maxParallel=50 --target=serve --projects=${selectedProjects.join(
      ","
    )}`,
    label: "Running amplication services...",
  };
  runFunction(startServices);
};

main();
